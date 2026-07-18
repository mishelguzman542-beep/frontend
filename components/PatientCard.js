import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../styles/colors';

const PatientCard = ({ patient, onEdit, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Eliminar Paciente',
      `¿Estás seguro de eliminar a ${patient.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => onDelete(patient.id), style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="person-circle-outline" size={50} color={colors.primary} />
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.name}>{patient.nombre}</Text>
          <Text style={styles.diagnosis}>{patient.diagnostico}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Icon name="calendar-outline" size={18} color={colors.gray} />
          <Text style={styles.detailText}>Edad: {patient.edad} años</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="person-outline" size={18} color={colors.gray} />
          <Text style={styles.detailText}>Sexo: {patient.sexo}</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="call-outline" size={18} color={colors.gray} />
          <Text style={styles.detailText}>{patient.telefono}</Text>
        </View>
        {patient.direccion && (
          <View style={styles.detailItem}>
            <Icon name="location-outline" size={18} color={colors.gray} />
            <Text style={styles.detailText}>{patient.direccion}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => onEdit(patient)}
        >
          <Icon name="create-outline" size={20} color={colors.primary} />
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={handleDelete}
        >
          <Icon name="trash-outline" size={20} color={colors.danger} />
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  diagnosis: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 2,
  },
  detailsContainer: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  detailText: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#E3F2FD',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  editText: {
    color: colors.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  deleteText: {
    color: colors.danger,
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default PatientCard;