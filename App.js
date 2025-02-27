/*
 *
 *  CREAR UNA APLICACION EN REACT NATIVE CON EXPO
 *
 *  Requisitos:
 *  1. Pantalla Principal
 *      a.  Mostrar una cuadrícula de imágenes en dos columnas.
 *      b.  Cargar más imágenes automáticamente cuando el usuario se
 *          desplace hacia abajo (desplazamiento infinito).
 *      c.  Cada imagen debe ser un elemento táctil que redirija a una
 *          pantalla de detalles.
 *  2. Pantalla de Detalles
 *      a.  Mostrar la imagen seleccionada en el centro de la pantalla.
 *      b.  Mostrar información adicional (Ej: autor, ancho y alto).
 *      c.  Implementar navegación entre la pantalla principal y la
 *          pantalla de detalles.
 *  3. API
 *      a.  Emplear la API de generación de imágenes aleatoria de
 *          Picsum.
 *  4. Estilos
 *      a.  Aplicar estilos para que la aplicación sea responsive.
 *
 *  Dependencias:
 *  - React
 *  - React Native
 *
 *  Componentes y módulos de React Native:
 *  - ActivityIndicator: Indicador de carga.
 *  - Button: Botón simple.
 *  - Dimensions: Dimensiones de la pantalla.
 *  - Image: Muestra imágenes.
 *  - Modal: Ventana modal.
 *  - ScrollView: Vista desplazable.
 *  - StatusBar: Barra de estado.
 *  - StyleSheet: Hojas de estilo.
 *  - Text: Muestra texto.
 *  - TouchableOpacity: Botón táctil.
 *  - View: Contenedor básico.
 *
 *  Funcionalidades de JS:
 *  - async/await: Manejo de operaciones asíncronas
 *  - fetch: Peticiones HTTP
 *  - useState, useEffect: Hooks de React
 *
 *  @author Jose Naranjo
 *  @date 27-2-2025
 * 
 */


// Importar React y los hooks useState y useEffect, de la libreria React
import React, { useState, useEffect } from 'react';
// Importar componentes y modulos de React Native
import { View, Image, StyleSheet, ScrollView, Dimensions, Modal, Text, TouchableOpacity, ActivityIndicator, StatusBar, Button } from 'react-native';

// Definir el componente funcional de la app
const RandomImages = () => {
    // Definir el estado imageUrls para almacenar las URLs de las imágenes
    const [imageUrls, setImageUrls] = useState([]);
    // Definir el estado selectedImage para almacenar la URL de la imagen seleccionada
    const [selectedImage, setSelectedImage] = useState(null);
    // Definir el estado imageData para almacenar los datos de la imagen
    const [imageData, setImageData] = useState(null);
    // Definir el estado loading para indicar la carga delos datos
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadInitialImages();
    }, []);

    // Funcion para cargar las imágenes iniciales
    const loadInitialImages = () => {
        // Llama a la función loadMoreImages para cargar 10 imágenes
        loadMoreImages(10);
    };

    // Funcion para cargar más imágenes
    const loadMoreImages = (count) => {
        // Inicializa un array vacío para almacenar las nuevas URL
        const newUrls = [];
        // Generador de las URLs de las imágenes
        for (let i = 0; i < count; i++) {
            // Genera un número aleatorio
            const random = Math.random();
            // Calcula el ancho de la imagen
            const width = Math.floor(Dimensions.get('window').width / 2 - 67.5);
            // Calcula el alto de la imagen
            const height = Math.floor(Dimensions.get('window').width / 2 - 60);
            // Genera la URL de la imagen y la agrega al array
            newUrls.push(`https://picsum.photos/id/${Math.floor(random * 500)}/${width}/${height}`);
        }
        // Actualiza el estado imageUrls con las nuevas URLs
        setImageUrls(prevUrls => [...prevUrls, ...newUrls]);
    };

    // Función para manejar el scroll
    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

        // Verifica si el usuario ha llegado al final del ScrollView
        if (offsetY + scrollViewHeight >= contentHeight - 200) {
            // Llama a la función loadMoreImages para cargar más imágenes
            loadMoreImages(10);
        }
    };

    // Función asíncrona para obtener los datos de la imagen
    const getImageData = async (url) => {
        // Establece el estado loading a true
        setLoading(true);
        // Bloque try...catch para manejar errores
        try {
            // Obtiene el ID de la imagen de la URL
            const id = url.split('/id/')[1].split('/')[0];
            // Genera la URL de la API
            const apiUrl = `https://picsum.photos/id/${id}/info`;
            // Realiza una petición HTTP a la API
            const response = await fetch(apiUrl);
            // Convierte la respuesta a JSON
            const data = await response.json();
            // Actualiza el estado imageData con los datos de la imagen
            setImageData(data);
        } catch (error) {
            // Maneja los errores
            console.error('Error al obtener los datos de la imagen:', error);
        } finally {
            // Bloque finally que se ejecuta siempre
            setLoading(false);
        }
    };

    // Función para cerra la imagen y regresar a la lista
    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    // Función para renderizar las columnas de imágenes
    const renderColumns = () => {
        // Inicializa un array vacío para cada columna
        const column1 = [];
        const column2 = [];

        // Itera sobre el array imageUrls
        imageUrls.forEach((url, index) => {
            // Verifica si el índice es par
            if (index % 2 === 0) {
                // Agrega la imagen a la primera columna
                column1.push(
                    // Convertir la imagen en un bonton tactil
                    <TouchableOpacity key={index} onPress={() => {
                        // Cargar url en el estado selectedImage
                        setSelectedImage(url);
                        // Obtener los datos de la imagen
                        getImageData(url);
                    }}>
                        {/* Mostrar la imagen*/}
                        <Image source={{ uri: url }} style={styles.image} />
                    </TouchableOpacity>
                );
            } else {
                // Agrega la imagen a la segunda columna
                column2.push(
                    <TouchableOpacity key={index} onPress={() => {
                        setSelectedImage(url);
                        getImageData(url);
                    }}>
                        <Image source={{ uri: url }} style={styles.image} />
                    </TouchableOpacity>
                );
            }
        });

        // Organizar las imagenes en dos columnas
        return (
            <View style={styles.columnsContainer}>
                <View style={[styles.column, styles.rightAlignColumn]}>{column1}</View>
                <View style={[styles.column, styles.leftAlignColumn]}>{column2}</View>
            </View>
        );
    };

// Retorna la vista principal del componente
return (
    // Contenedor principal que ocupa toda la pantalla
    <View style={{ flex: 1 }}>
        {/* Componente StatusBar para controlar la barra de estado */}
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        {/* Componente ScrollView para crear una vista desplazable */}
        <ScrollView style={styles.container} onScroll={handleScroll}>
            {/* Llama a la función renderColumns para renderizar las columnas de imágenes */}
            {renderColumns()}
        </ScrollView>
        {/* Componente Modal para mostrar los detalles de la imagen seleccionada */}
        <Modal visible={!!selectedImage} onRequestClose={() => setSelectedImage(null)}>
            {/* Contenedor principal del modal */}
            <View style={styles.modalContainer}>
                {/* Contenedor del contenido del modal */}
                <View style={styles.modalContent}>
                    {/* Contenedor del botón de cierre */}
                    <View style={styles.closeButtonContainer}>
                        {/* Botón para cerrar el modal */}
                        <Button title="Cerrar" onPress={handleCloseModal} />
                    </View>
                    {/* Contenedor para la imagen y los datos de la imagen */}
                    <View style={styles.imageTextContainer}>
                        {/* Componente Image para mostrar la imagen seleccionada en el modal */}
                        <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
                        {/* Renderizado condicional: muestra ActivityIndicator si loading es true, o los datos de la imagen si imageData existe */}
                        {loading ? (
                            // Indicador de carga
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : imageData && (
                            // Contenedor para los datos de la imagen
                            <View style={styles.metadataContainer}>
                                 {/* Texto para mostrar los metadatos */}
                                <Text style={styles.metadataText}>Autor: {imageData.author}</Text>
                                <Text style={styles.metadataText}>Ancho: {imageData.width}</Text>
                                <Text style={styles.metadataText}>Alto: {imageData.height}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    </View>
);
};

// Definicion de los estilos
const styles = StyleSheet.create({
    // Estilos para el contenedor principal del ScrollView
    container: {
        flex: 1, // Permite que el contenedor ocupe todo el espacio disponible
        marginTop: 15, // Agrega un margen superior de 15 píxeles
        paddingHorizontal: '5%', // Agrega un relleno horizontal del 5% del ancho de la pantalla
    },
    // Estilos para el contenedor de las columnas de imágenes
    columnsContainer: {
        flexDirection: 'row', // Organiza los elementos en fila
        justifyContent: 'space-between', // Distribuye el espacio entre las columnas
    },
    // Estilos comunes para cada columna
    column: {
        flex: 1, // Permite que cada columna ocupe el mismo espacio
        padding: 5, // Agrega un relleno de 5 píxeles a cada columna
    },
    // Estilos para la columna alineada a la derecha
    rightAlignColumn: {
        alignItems: 'flex-end', // Alinea los elementos al final de la columna (derecha)
    },
    // Estilos para la columna alineada a la izquierda
    leftAlignColumn: {
        alignItems: 'flex-start', // Alinea los elementos al inicio de la columna (izquierda)
    },
    // Estilos para cada imagen
    image: {
        width: Dimensions.get('window').width / 2 - 67.5, // Calcula el ancho de la imagen
        height: Dimensions.get('window').width / 2 - 60, // Calcula el alto de la imagen
        marginBottom: 30, // Agrega un margen inferior de 30 píxeles
        marginHorizontal: 7.5, // Agrega un margen horizontal de 7.5 píxeles
     },
    // Estilos para una fila (no se usa en el codigo proporcionado, pero esta aqui)
    row: {
        flexDirection: 'row', // Organiza los elementos en fila
        justifyContent: 'space-between', // Distribuye el espacio entre los elementos
    },
    // Estilos para el contenedor principal del Modal
    modalContainer: {
        flex: 1, // Permite que el contenedor ocupe todo el espacio disponible
        justifyContent: 'center', // Centra el contenido verticalmente
        alignItems: 'center', // Centra el contenido horizontalmente
        backgroundColor: 'white', // Establece el color de fondo a blanco
    },
    // Estilos para el contenido del Modal (modalContent)
    modalContent: {
        alignItems: 'center',
        position: 'relative', // Asegurar que modalContent sea el contexto para el botón
    },
    // Estilos para la imagen dentro del Modal (modalImage)
    modalImage: {
        width: Dimensions.get('window').width - 50, // Ancho de la pantalla menos 30 píxeles
        height: Dimensions.get('window').height - 50, // Alto de la pantalla menos 30 píxeles
        position: 'relative', // Asegurar que modalImage sea el contexto para la metadata
    },
    // Estilos para la metadata
    metadataContainer: {
        position: 'absolute', // Posicionar la metadata dentro de la imagen
        bottom: 10, // Pposicionar a 10 píxeles del borde inferior de la imagen
        right: 10, // Pposicionar a 10 píxeles del borde derecho de la imagen
        backgroundColor: 'rgba(0, 0, 0, 0.14)', // Fondo semitransparente para la metadata
        padding: 5, // Agregar un relleno de 5 píxeles alrededor de la metadata
    },
    // Estilos para el texto de la metadata
    metadataText: {
        color: 'black', // Establece el color del texto de la metadata
        textAlign: 'right', // Alinea el texto a la derecha
        fontSize: 16, // Cambia el tamaño de letra aquí
    },
    // Estilos para el contenedor de la imagen y el texto
    imageTextContainer: {
        flexDirection: 'row', // La imagen y la metadata en fila
        alignItems: 'flex-start', // Alinear la metadata en la parte superior
    },
    // Estilos para el contenedor del botón de cierre
    closeButtonContainer: {
        position: 'absolute', // Posiciona el botón de cierre de forma absoluta dentro del modal
        top: 10, // Lo posiciona a 10 píxeles del borde superior del modal
        left: 10, // Lo posiciona a 10 píxeles del borde izquierdo del modal
        zIndex: 1, // Asegura que el botón de cierre se muestre encima de otros elementos del modal
    },
    // Estilos para el contenido del Modal (modalContent)
    modalContent: {
        alignItems: 'center', // Centra los elementos horizontalmente dentro del modal.
        position: 'relative', // Establece el contexto de posicionamiento para elementos absolutos dentro de este contenedor
        //flexDirection: Dimensions.get('window').height > Dimensions.get('window').width ? 'column' : 'row', // Comentado: permite cambiar la dirección del layout basado en la orientación de la pantalla.
    },
    // Estilos para la imagen dentro del Modal (modalImage)
    modalImage: {
        width: Dimensions.get('window').width - 50, // Establece el ancho de la imagen al ancho de la pantalla menos 50 píxeles
        height: Dimensions.get('window').height - 50, // Establece el alto de la imagen al alto de la pantalla menos 50 píxeles
        position: 'relative', // Establece el contexto de posicionamiento para la metadata dentro de la imagen
    },
    // Estilos para el contenedor de la metadata (metadataContainer)
    metadataContainer: {
        position: 'absolute', // Posiciona el contenedor de la metadata de forma absoluta dentro de la imagen
        bottom: 10, // Lo posiciona a 10 píxeles del borde inferior de la imagen
        right: 10, // Lo posiciona a 10 píxeles del borde derecho de la imagen
        backgroundColor: 'rgba(0, 0, 0, 0.14)', // Establece un fondo semitransparente para la metadata
        padding: 5, // Agrega un relleno de 5 píxeles alrededor de la metadata
    },
    // Estilos para el texto de la metadata (metadataText)
    metadataText: {
        color: 'black', // Establece el color del texto de la metadata a negro
        textAlign: 'right', // Alinea el texto de la metadata a la derecha
        fontSize: 16, // Establece el tamaño de la fuente de la metadata a 16 píxeles
    },
    // Estilos para el contenedor de la imagen y el texto
    imageTextContainer: {
        flexDirection: 'row', // Organiza la imagen y la metadata en fila
        alignItems: 'flex-start', // Alinea la imagen y la metadata a la parte superior de la fila
    },
    // Estilos para el contenedor del botón de cierre (closeButtonContainer)
    closeButtonContainer: {
        position: 'absolute', // Posicionar el botón de forma absoluta dentro del modal
        top: 10, // Posicionar a 10 píxeles del borde superior del modal
        left: 10, // Posicionar a 10 píxeles del borde izquierdo del modal
        zIndex: 1, // Asegurar que el botón de cierre se muestre encima de otros elementos del modal
    },   
});

export default RandomImages; // Exportar el componente para que pueda ser utilizado
