import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const MileStoneScreen = () => {
  const [completedMilestones, setCompletedMilestones] = useState(2);
  const totalMilestones = 4;

  const renderMilestoneIndicators = () => {
    const indicators = [];
    for (let i = 0; i < totalMilestones; i++) {
      const isCompleted = i < completedMilestones;
      const indicatorStyle = isCompleted
        ? styles.milestoneIndicatorCompleted
        : styles.milestoneIndicator;
      indicators.push(
        <View
          key={i}
          style={[styles.milestoneIndicatorContainer, indicatorStyle]}
        />
      );
    }
    return indicators;
  };

  const handleCompleteMilestone = () => {
    if (completedMilestones < totalMilestones) {
      setCompletedMilestones((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Milestones</Text>
      <View style={styles.progressContainer}>
        {renderMilestoneIndicators()}
      </View>
      <Text style={styles.progressText}>
        Group completed {completedMilestones} out of {totalMilestones} milestones
      </Text>
      {completedMilestones < totalMilestones && (
        <TouchableOpacity
          style={styles.button}
          onPress={handleCompleteMilestone}
        >
          <Text style={styles.buttonText}>Complete Milestone</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  milestoneIndicatorContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "#000",
  },
  milestoneIndicator: {
    backgroundColor: "#FFF",
  },
  milestoneIndicatorCompleted: {
    backgroundColor: "#00FF00",
    borderColor: "#00FF00",
  },
  progressText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#F39920",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default MileStoneScreen;
