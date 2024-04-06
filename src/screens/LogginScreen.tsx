import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Snackbar, Text, TextInput } from 'react-native-paper'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../configs/firebaseConfig';
import { CommonActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { styles } from '../theme/style';

interface LoginForm {
  email: string;
  password: string;
}

interface MessageSnackBar {
  visible: boolean;
  message: string;
  color: string;
}

export const LogginScreen = () => {

  //hook mostrar contraseña
  const [hiddenPassword, setrHiddenPassword] = useState(true)

  //hook de navegacion
  const navigationHook = useNavigation();

  //Hook useState: trabajar con el estado del formulario
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });


    //Hook useState: trabajar con el manejo de mensajes dinámicos
    const [messageSnackBar, setMessageSnackBar] = useState<MessageSnackBar>({
      visible: false,
      message: "",
      color: "#fff",
    });
  
    //Función para actualizar datos del formulario
    const handlerSetLoginForm = (key: string, value: string) => {
      setLoginForm({ ...loginForm, [key]: value });
    };
  
    const handlerLogin = async () => {
      if (!loginForm.email || !loginForm.password) {
        // cambiar estado para visualizar el mensaje
        setMessageSnackBar({
          visible: true,
          message: "Complete todos los campos",
          color: "#962841",
        });
        return;
      }
      //Login usuario
      try {
        const response = await signInWithEmailAndPassword(
          auth,
          loginForm.email,
          loginForm.password
        );
        console.log(response);
      } catch (e) {
        console.log(e);
        setMessageSnackBar({
          visible: true,
          message: "Usuario y/o contraseña incorrecta",
          color: "#962841",
        });
      }
    };
  

  return (
    
    <View style={styles.content}>
      <Text variant="headlineMedium">Inicia Sesión</Text>
      <TextInput
        mode="outlined"
        label="Correo"
        placeholder="Escribe tu correo"
        style={styles.inputs}
        onChangeText={(value) => handlerSetLoginForm("email", value)}
      />
      <TextInput
        mode="outlined"
        label="Contraseña"
        placeholder="Escribe tu contraseña"
        secureTextEntry={hiddenPassword}
        right={<TextInput.Icon icon="eye" onPress={()=>setrHiddenPassword(!hiddenPassword)}/>}
        style={styles.inputs}
        onChangeText={(value) => handlerSetLoginForm("password", value)}
      />
      <Button
        mode="contained"
        onPress={() => handlerLogin()}
        style={styles.buttons}
      >
        Iniciar
      </Button>
      <Snackbar
        visible={messageSnackBar.visible}
        onDismiss={() =>
          setMessageSnackBar({ ...messageSnackBar, visible: false })
        }
        style={{ backgroundColor: messageSnackBar.color }}
      >
        {messageSnackBar.message}
      </Snackbar>
      <Text
      style={styles.textNavigation}
      onPress={()=>navigationHook.dispatch(CommonActions.navigate({name:'Register'}))}
      >No tienes una cuenta? Registrate</Text>
    </View>
  )
}

