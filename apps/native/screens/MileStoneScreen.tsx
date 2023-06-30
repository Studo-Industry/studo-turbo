import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

interface FileObject {
  uri: string;
  name: string;
  fileType?: string;
}

interface CardProps {
  index: number;
  isCurrentCard: boolean;
  isPreviousCardSubmitted: boolean;
  handleCardSubmit: () => void;
}

const Card: React.FC<CardProps> = ({
  index,
  isCurrentCard,
  isPreviousCardSubmitted,
  handleCardSubmit,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileObject[]>([]);
  const [completed, setCompleted] = useState(false);

  const handleUploadFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: false,
      multiple: true,
    });

    if (result.type === 'success') {
      const { uri, name } = result;
      const fileType = getFileExtension(name);

      const fileObject = {
        uri,
        name,
        fileType,
      };

      setUploadedFiles((prevFiles) => [...prevFiles, fileObject]);
    }
  };

  const handleDeleteFile = (index: number) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
    setCompleted(false);
  };

  const handleSubmit = () => {
    if (uploadedFiles.length > 0) {
      setCompleted(true);
      handleCardSubmit();
      console.log('Submitted!');
    }
  };

  const getFileExtension = (filename: string) => {
    const parts = filename.split('.');
    return parts[parts.length - 1].toLowerCase();
  };

  const openFile = (uri: string, fileType?: string) => {
    if (fileType === 'pdf' || fileType === 'ppt') {
      Linking.openURL(uri);
    } else {
      // Handling image files
      // You may need to install additional libraries or implement your own logic to open different file types
      // For example, you can use `react-native-photo-view` library to display images in a modal
      // or use a PDF library to render PDF files
      // This implementation is just for demonstration purposes
      Linking.openURL(uri);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.titleContainer}>
        <Text style={styles.number}>{index + 1}</Text>
        <Text style={styles.title}>Milestone Title</Text>
        {!completed ? (
          <Text style={styles.incompleteText}>Incomplete</Text>
        ) : (
          <Text style={styles.completedText}>Completed!</Text>
        )}
      </View>
      {isCurrentCard && (
        <>
          <Text style={styles.descriptionT}>Description</Text>
          <Text style={styles.description}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </Text>
          {uploadedFiles.length > 0 && (
            <View style={styles.fileContainer}>
              {uploadedFiles.map((file, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.fileItem}
                  onPress={() => openFile(file.uri, file.fileType)}
                >
                  {file.fileType === 'image' ? (
                    <Image source={{ uri: file.uri }} style={styles.image} />
                  ) : (
                    <Text>{file.name}</Text>
                  )}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteFile(index)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadFile}
          >
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton,
              uploadedFiles.length === 0 && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={uploadedFiles.length === 0}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const MileStoneScreen: React.FC = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [submittedCardIndex, setSubmittedCardIndex] = useState(-1);

  const handleCardSubmit = () => {
    setSubmittedCardIndex(currentCardIndex);
    setCurrentCardIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        {[0, 1, 2, 3].map((index) => {
          const isCurrentCard = index === currentCardIndex;
          const isPreviousCardSubmitted = index < submittedCardIndex;

          return (
            <Card
              key={index}
              index={index}
              isCurrentCard={isCurrentCard}
              isPreviousCardSubmitted={isPreviousCardSubmitted}
              handleCardSubmit={handleCardSubmit}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  cardContainer: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    width: '92%',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 10,
    shadowColor: '#000',
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  number: {
    fontSize: 20,
    fontWeight: 'normal',
    marginRight: 5,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'normal',
  },
  incompleteText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  completedText: {
    color: '#00FF00',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  descriptionT: {
    fontSize: 16,
    marginBottom: 1,
    fontWeight: 'bold',
  },
  fileContainer: {
    marginBottom: 20,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
    position: 'absolute',
    right: 0,
    paddingBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#F39920',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4287f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default MileStoneScreen;
