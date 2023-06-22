import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MyTeam = ({ teamMembers }) => {
  const referralCode = 'Studio12345';

  const handleCopy = () => {
    Clipboard.setString(referralCode);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Referral Code</Text>
          <View style={styles.card}>
            <Text style={styles.referralCode}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              <Ionicons name="copy" size={24} color="#333333" />
            </TouchableOpacity>
          </View>
        </View>

        {teamMembers.map((member, index) => (
          <View style={styles.section} key={index}>
            <Text style={styles.sectionTitle}>{member.role}</Text>
            {member.entities.map((entity, nestedIndex) => (
              <View
                style={[styles.memberContainer, { marginBottom: 10 }]}
                key={nestedIndex}
              >
                <Image source={entity.photo} style={styles.memberPhoto} />
                <View>
                  <Text style={styles.memberName}>{entity.name}</Text>
                  <Text style={styles.memberEmail}>{entity.email}</Text>
                </View>
              </View>
            ))}
            {index === teamMembers.length - 1 && (
              <>
                <TouchableOpacity
                  style={[styles.card, styles.viewRankingsCard]}
                >
                  <Text
                    style={[
                      styles.viewRankingsText,
                      { color: '#000', fontSize: 18 },
                    ]}
                  >
                    View Rankings
                  </Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={24}
                    color="#666"
                    style={styles.icon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.card, styles.viewMilestoneCard]}
                >
                  <Text
                    style={[
                      styles.viewRankingsText,
                      { color: '#000', fontSize: 18 },
                    ]}
                  >
                    View Milestone
                  </Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={24}
                    color="#666"
                    style={styles.icon}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, styles.viewProjectCard]}>
                  <Text
                    style={[
                      styles.viewRankingsText,
                      { color: '#000', fontSize: 18 },
                    ]}
                  >
                    View Project
                  </Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={24}
                    color="#666"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#666',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOpacity: 1,
    shadowOffset: {
      width: 2,
      height: 10,
    },
    shadowRadius: 4,
    elevation: 10,
  },
  referralCode: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  copyButton: {
    backgroundColor: '#DDDDDD',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 'auto',
  },
  viewRankingsCard: {
    marginTop: 10,
  },
  viewMilestoneCard: {
    marginTop: 13, // Adjust the marginTop to increase or decrease the gap
    backgroundColor: '#FFFFFF',
  },
  viewProjectCard: {
    marginTop: 13, // Adjust the marginTop to increase or decrease the gap
    backgroundColor: '#FFFFFF',
  },
  viewRankingsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#000',
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
  },
  icon: {
    marginLeft: 'auto',
  },
});

const teamMembers = [
  {
    role: 'Leader',
    entities: [
      {
        // photo: require('../img/about.png'),
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
    ],
  },
  {
    role: 'Mentor',
    entities: [
      {
        // photo: require('../img/about.png'),
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
      },
    ],
  },
  {
    role: 'Member',
    entities: [
      {
        // photo: require('../img/about.png'),
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
      },
      {
        // photo: require('../img/about.png'),
        name: 'Emily Brown',
        email: 'emily.brown@example.com',
      },
      {
        // photo: require('../img/about.png'),
        name: 'Michael Lee',
        email: 'michael.lee@example.com',
      },
      {
        // photo: require('../img/about.png'),
        name: 'Sarah Thompson',
        email: 'sarah.thompson@example.com',
      },
    ],
  },
];

// export default function App() {
//   return <MyTeam teamMembers={teamMembers} />;
// }
export default function App() {
  return <MyTeam teamMembers={teamMembers} />;
}

