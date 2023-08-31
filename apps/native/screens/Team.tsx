import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberId, setNewMemberId] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleCreateTeam = () => {
    setModalVisible(true);
  };

  const handleAddMember = () => {
    if (newMemberName && newMemberId) {
      if (selectedTeam.members.length < 4) { // Allow up to 4 members
        const updatedMembers = [
          ...selectedTeam.members,
          { id: newMemberId, name: newMemberName },
        ];

        const updatedTeams = teams.map((team) =>
          team === selectedTeam
            ? { ...team, members: updatedMembers }
            : team
        );

        setTeams(updatedTeams);
        setModalVisible(false);
        setNewTeamName("");
        setNewMemberName("");
        setNewMemberId("");
        setSelectedTeam(null);
      } else {
        Alert.alert(
          "Cannot Add More Members",
          "Maximum 4 members allowed per team."
        );
      }
    } else {
      Alert.alert("Invalid Input", "Please enter valid member name and ID.");
    }
  };

  const handleRemoveMember = (team, memberIndex) => {
    const updatedMembers = team.members.filter(
      (_, index) => index !== memberIndex
    );
    const updatedTeams = teams.map((t) =>
      t === team ? { ...t, members: updatedMembers } : t
    );
    setTeams(updatedTeams);
  };

  const handleCreateNewTeam = () => {
    if (!teams.some((team) => team.name === newTeamName)) {
      const newTeam = { name: newTeamName, members: [] };
      setTeams([...teams, newTeam]);
      setModalVisible(false);
      setNewTeamName("");
      setNewMemberName("");
      setNewMemberId("");
      setSelectedTeam(newTeam);
    } else {
      Alert.alert(
        "Team Already Exists",
        "A team with the same name already exists."
      );
    }
  };

  const handleDeleteTeam = (team) => {
    const updatedTeams = teams.filter((t) => t !== team);
    setTeams(updatedTeams);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewTeamName("");
    setNewMemberName("");
    setNewMemberId("");
    setSelectedTeam(null);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Team Page</Text>
        {teams.map((team, index) => (
          <View key={index} style={styles.teamContainer}>
            <View style={styles.teamHeader}>
              <Text
                style={[
                  styles.teamName,
                  { fontWeight: "bold", color: "red" }, // Bold and red color
                ]}
              >
                Team Name: {team.name}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTeam(team)}
              >
                <Text style={styles.deleteButtonText}>Delete Team</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.memberListTitle}>Team Members:</Text>
            {team.members.map((member, memberIndex) => (
              <View key={memberIndex} style={styles.memberItemContainer}>
                <Text style={styles.memberItem}>
                  {member.name} (ID: {member.id})
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveMember(team, memberIndex)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateTeam}>
          <Text style={styles.createButtonText}>Create Team</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Team</Text>
              <TextInput
                placeholder="Team Name"
                style={styles.input}
                value={newTeamName}
                onChangeText={setNewTeamName}
              />
              {selectedTeam && selectedTeam.members.length < 4 && (
                <>
                  <TextInput
                    placeholder="Member Name"
                    style={styles.input}
                    value={newMemberName}
                    onChangeText={setNewMemberName}
                  />
                  <TextInput
                    placeholder="Member ID"
                    style={styles.input}
                    value={newMemberId}
                    onChangeText={setNewMemberId}
                    keyboardType="number-pad"
                  />
                </>
              )}
              <TouchableOpacity
                style={styles.addButton}
                onPress={
                  selectedTeam && selectedTeam.members.length < 4
                    ? handleAddMember
                    : handleCreateNewTeam
                }
              >
                <Text style={styles.addButtonText}>
                  {selectedTeam && selectedTeam.members.length < 4
                    ? "Add Member"
                    : "Create Team"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  teamName: {
    fontSize: 18,
    marginBottom: 10,
  },
  memberList: {
    marginTop: 10,
  },
  memberListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  memberItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  createButton: {
    backgroundColor: "#39B9B6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#39B9B6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginRight: 10,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },teamInfoContainer: {
    marginTop: 20,
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 10,
  },
  teamInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  teamInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  memberInfoList: {
    marginLeft: 20,
  },
  memberInfoItem: {
    fontSize: 14,
    marginBottom: 3,
  },
});

export default Team;
