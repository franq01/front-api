import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
} from "@chakra-ui/react";

import img from "../imgs/Isoftw.jpg";
import { Form, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "../libs/axios";
import { useRef } from "react";
import { useAuthStore } from "../store/auth";

type usuario = {
  email: string;
  password: string;
};

export default function SplitScreen() {
  const setToken = useAuthStore((state) => state.setToken);

  // Datos del formulario
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  // Consulta para login
  const { mutate, isError, isPending } = useMutation({
    mutationFn: (user: usuario) => axios.post("/user/login", user),
    onSuccess: (response) => {
      // Asegúrate de que el token esté en response.data.token
      setToken(response.data.token);
      navigate("/home");
    },
    onError: (error) => {
      console.error("Error en la petición:", error);
    },
  });

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"2xl"}>Iniciar sesión en tu cuenta</Heading>
          <FormControl id="email">
            <FormLabel>Correo Electrónico</FormLabel>
            <Input ref={email} type="email" />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Contraseña</FormLabel>
            <Input ref={password} type="password" />
          </FormControl>

          {
            isError && "Error al iniciar sesión. Verifica tus credenciales"
            //  <Text>
            //    Error al iniciar sesión. Verifica tus credenciales.
            //  </Text>
          }
          <Stack spacing={6}>
            <Button
              colorScheme={"blue"}
              variant={"solid"}
              onClick={(e) => {
                e.preventDefault();
                if (email.current?.value && password.current?.value) {
                  mutate({
                    email: email.current.value,
                    password: password.current.value,
                  });
                }
              }}
            >
              {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image alt={"Login Image"} objectFit={"cover"} src={img} />
      </Flex>
    </Stack>
  );
}
