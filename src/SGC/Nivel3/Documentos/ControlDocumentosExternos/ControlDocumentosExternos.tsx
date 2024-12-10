import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import Tabla from "../../Componentes/Tabla";
import axios from "../../../../libs/axios";

import { FormDataEncabezadoConDocEx } from "./Types";
import { useCrud } from "../../../../libs/useCrud";
import {
  createEncabezadoControlDocEx,
  ModalControlDocEx,
} from "./ModalControlDocEx";

const queryEncabezado = async (): Promise<FormDataEncabezadoConDocEx[]> =>
  (await axios.get("/api/controlDocumentosExternos")).data;

const deleteEncabezado = async (id: string): Promise<void> =>
  await axios.delete(`/api/controlDocumentosExternos/${id}`);

const onDownloadPDF = async (id: string) => {
  try {
    const response = await axios.get(
      `/api/controlDocumentosExternos/reporte/pdf/${id}`,
      {
        responseType: "blob",
      }
    );
    const url = window.URL.createObjectURL(response.data);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error al abrir el PDF:", error);
  }
};

const ControlDocumentosExternos = () => {
  const {
    items: data,
    isLoading,
    error,
    deleteItem,
  } = useCrud<FormDataEncabezadoConDocEx>({
    queryKey: ["ControlDocEx"],
    getAll: queryEncabezado,
    //createItem: () => Promise.resolve({}), // Dejar vacío si no se usa en este componente
    //updateItem: () => Promise.resolve({}), // Dejar vacío si no se usa en este componente
    createItem: createEncabezadoControlDocEx, // Utiliza la función real para crear registros
    updateItem: () =>
      Promise.resolve({
        coDocumento: "",
        noRevision: "",
        fechaEmicion: "",
        fechaRevision: "",
        idControlDocumentosExternos: undefined,
        area: "",
        seccion: "",
        fecha: "",
      }), // Valor ficticio
    deleteItem: deleteEncabezado,
  });

  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex alignItems="center" justifyContent="center" height="100vh">
        <Text color="red.500">Error al cargar los datos.</Text>
      </Flex>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Flex alignItems="center" justifyContent="center" height="100vh">
        <Text>No hay datos disponibles.</Text>
      </Flex>
    );
  }

  // Asigna `id` usando `idListadoDistribucionDocumentos` y lo convierte a string
  const dataNueva = data.map((item) => ({
    ...item,
    id: String(item.idControlDocumentosExternos),
  }));

  return (
    <Flex
      minHeight="calc(100vh - 64px)"
      alignItems="center"
      justifyContent="center"
      p={4}
      flexDirection="column"
    >
      <ModalControlDocEx />

      <Flex
        alignItems="center"
        justifyContent="center"
        p={4}
        flexDirection="column"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="black"
        borderRadius="md"
        boxShadow="md"
        maxWidth="1100px"
        width="100%"
        margin="0 auto"
        mt={8}
      >
        <Heading
          as="h1"
          size="lg"
          mb={4}
          bg="black"
          color="white"
          p={2}
          width="100%"
          textAlign="center"
          borderTopLeftRadius="md"
          borderTopRightRadius="md"
        >
          CONTROL DE DOCUMENTOS EXTERNOS
        </Heading>

        <Tabla
          nombreForm="hola"
          data={dataNueva}
          onDelete={deleteItem}
          onDownloadPDF={onDownloadPDF} // Pasar onDownloadPDF a Tabla
        />
      </Flex>
    </Flex>
  );
};

export default ControlDocumentosExternos;
