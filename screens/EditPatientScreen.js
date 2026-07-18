import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { updatePatient } from '../services/api';
import colors from '../styles/colors';

const EditPatientScreen = ({ route, navigation }) => {
  const { patient } = route.params;
  const [formData, setFormData] = useState({
    nombre: patient.nombre || '',
    edad: patient.edad ? patient.edad.toString() : '',
    sexo: patient.sexo || '',
    telefono: patient.telefono || '',
    diagnostico: patient.diagnostico || '',
    direccion: patient.direccion || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar edad
    if (!formData.edad.trim()) {
      newErrors.edad = 'La edad es obligatoria';
    } else if (isNaN(formData.edad)) {
      newErrors.edad = 'La edad debe ser un número';
    } else if (parseInt(formData.edad) < 0) {
      newErrors.edad = 'La edad no puede ser negativa';
    } else if (parseInt(formData.edad) > 120) {
      newErrors.edad = 'La edad no puede ser mayor a 120 años';
    }

    // Validar sexo
    if (!formData.sexo.trim()) {
      newErrors.sexo = 'El sexo es obligatorio';
    }

    // Validar teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (formData.telefono.length < 7) {
      newErrors.telefono = 'El teléfono debe tener al menos 7 dígitos';
    }

    // Validar diagnóstico
    if (!formData.diagnostico.trim()) {
      newErrors.diagnostico = 'El diagnóstico es obligatorio';
    } else if (formData.diagnostico.length < 3) {
      newErrors.diagnostico = 'El diagnóstico debe tener al menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const patientData = {
        nombre: formData.nombre.trim(),
        edad: parseInt(formData.edad),
        sexo: formData.sexo.trim(),
        telefono: formData.telefono.trim(),
        diagnostico: formData.diagnostico.trim(),
        direccion: formData.direccion.trim() || null,
      };
      
      await updatePatient(patient.id, patientData);
      Alert.alert('✅ Éxito', 'Paciente actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          Alert.alert('❌ Error', 'Paciente no encontrado');
        } else if (error.response.status === 400) {
          Alert.alert('❌ Error', 'Datos inválidos');
        } else {
          Alert.alert('❌ Error', error.response.data.message || 'Error al actualizar');
        }
      } else if (error.request) {
        Alert.alert('⚠️ Error de conexión', 'No se pudo conectar con el servidor');
      } else {
        Alert.alert('❌ Error', 'Ocurrió un error inesperado');
      }
      console.error('Error actualizando paciente:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Editar Paciente</Text>
          <Text style={styles.subtitle}>Actualiza los datos del paciente</Text>
        </View>

        <View style={styles.form}>
          {/* Nombre */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre completo *</Text>
            <View style={[styles.inputGroup, errors.nombre && styles.inputError]}>
              <Icon name="person-outline" size={20} color={colors.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChangeText={(text) => handleChange('nombre', text)}
                editable={!loading}
              />
            </View>
            {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
          </View>

          {/* Edad y Sexo */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Edad *</Text>
              <View style={[styles.inputGroup, errors.edad && styles.inputError]}>
                <Icon name="calendar-outline" size={20} color={colors.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 35"
                  keyboardType="numeric"
                  value={formData.edad}
                  onChangeText={(text) => handleChange('edad', text)}
                  editable={!loading}
                />
              </View>
              {errors.edad && <Text style={styles.errorText}>{errors.edad}</Text>}
            </View>

            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Sexo *</Text>
              <View style={[styles.inputGroup, errors.sexo && styles.inputError]}>
                <Icon name="male-female-outline" size={20} color={colors.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Masculino"
                  value={formData.sexo}
                  onChangeText={(text) => handleChange('sexo', text)}
                  editable={!loading}
                />
              </View>
              {errors.sexo && <Text style={styles.errorText}>{errors.sexo}</Text>}
            </View>
          </View>

          {/* Teléfono */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono *</Text>
            <View style={[styles.inputGroup, errors.telefono && styles.inputError]}>
              <Icon name="call-outline" size={20} color={colors.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej: 0999999999"
                keyboardType="phone-pad"
                value={formData.telefono}
                onChangeText={(text) => handleChange('telefono', text)}
                editable={!loading}
              />
            </View>
            {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
          </View>

          {/* Diagnóstico */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Diagnóstico *</Text>
            <View style={[styles.inputGroup, errors.diagnostico && styles.inputError]}>
              <Icon name="medical-outline" size={20} color={colors.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej: Hipertensión"
                value={formData.diagnostico}
                onChangeText={(text) => handleChange('diagnostico', text)}
                editable={!loading}
              />
            </View>
            {errors.diagnostico && <Text style={styles.errorText}>{errors.diagnostico}</Text>}
          </View>

          {/* Dirección */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dirección</Text>
            <View style={styles.inputGroup}>
              <Icon name="location-outline" size={20} color={colors.gray} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ej: Av. Principal #123"
                multiline
                numberOfLines={3}
                value={formData.direccion}
                onChangeText={(text) => handleChange('direccion', text)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.saveText}> Actualizando...</Text>
                </>
              ) : (
                <>
                  <Icon name="refresh-circle-outline" size={20} color={colors.white} />
                  <Text style={styles.saveText}>Actualizar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 4,
  },
  form: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 6,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.black,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  cancelText: {
    color: colors.gray,
    fontSize: 16,
    fontWeight: '600',
  },
  saveText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default EditPatientScreen;