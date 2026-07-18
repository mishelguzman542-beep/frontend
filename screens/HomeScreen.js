import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import PatientCard from '../components/PatientCard';
import { getPatients, deletePatient } from '../services/api';
import colors from '../styles/colors';

const HomeScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error cargando pacientes:', error);
      Alert.alert('❌ Error', 'No se pudieron cargar los pacientes');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPatients();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    try {
      await deletePatient(id);
      setPatients(patients.filter(p => p.id !== id));
      Alert.alert('✅ Éxito', 'Paciente eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando paciente:', error);
      Alert.alert('❌ Error', 'No se pudo eliminar el paciente');
    }
  };

  const handleEdit = (patient) => {
    navigation.navigate('EditPatient', { patient });
  };

  // ===== FUNCIÓN DE CERRAR SESIÓN =====
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel' 
        },
        { 
          text: 'Cerrar Sesión', 
          onPress: () => {
            navigation.replace('Login');  // Usamos replace para que no pueda volver con el botón atrás
          },
          style: 'destructive' 
        },
      ]
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="people-outline" size={80} color={colors.lightGray} />
      <Text style={styles.emptyText}>No hay pacientes registrados</Text>
      <Text style={styles.emptySubText}>
        Toca el botón + para agregar un paciente
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando pacientes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Lista de pacientes */}
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PatientCard
            patient={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      {/* ===== BOTÓN DE CERRAR SESIÓN ===== */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Icon name="log-out-outline" size={24} color={colors.white} />
      </TouchableOpacity>

      {/* ===== BOTÓN DE AGREGAR ===== */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddPatient')}
        activeOpacity={0.8}
      >
        <Icon name="add" size={30} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.gray,
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 90,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 8,
    textAlign: 'center',
  },
  // Botón de cerrar sesión (esquina superior derecha)
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  // Botón flotante para agregar (abajo derecha)
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 10,
  },
});

export default HomeScreen;