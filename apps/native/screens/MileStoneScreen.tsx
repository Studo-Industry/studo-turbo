import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

interface CardProps {
  index: number;
  isCurrentCard: boolean;
  isPreviousCardSubmitted: boolean;
  handleCardSubmit: () => void;
}

const Card: React.FC<CardProps> = ({ index, isCurrentCard, isPreviousCardSubmitted, handleCardSubmit }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleUploadImage = () => {
    // Code for uploading the image goes here
    // After uploading, set the uploaded image URL using setUploadedImage
    setUploadedImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnL8UdZ553sonNaZyy_mvsJWxq7ky6gx6B_YsncYQ8&s"
    );
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
    setCompleted(false);
  };

  const handleSubmit = () => {
    // Code for handling the submit action goes here
    if (uploadedImage) {
      setCompleted(true);
      handleCardSubmit(); // Notify the parent component that the card has been submitted
      console.log("Submitted!");
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
          <Text style={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</Text>
          {uploadedImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: uploadedImage }} style={styles.image} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteImage}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          {!uploadedImage && (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleUploadImage}
            >
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.submitButton,
              !uploadedImage && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!uploadedImage}
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
    backgroundColor: "#F5F5F5",
  },
  cardContainer: {
    padding: 20,
    alignItems: "center",
  },
  card: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#FFF",
    elevation: 3,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  number: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
  },
  incompleteText: {
    color: "#FF0000",
    fontWeight: "bold",
  },
  completedText: {
    color: "#00FF00",
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  descriptionT :{
    fontSize: 18,
    marginBottom: 1,
    fontWeight: "bold",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: "#F39920",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#4287f5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default MileStoneScreen;