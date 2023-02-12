import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Image, Button, TouchableOpacity } from "react-native";
import * as Contacts from "expo-contacts";
import { CheckBox, Input } from "react-native-elements";
import { COLORS, ROUTES } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { UserContext } from "./../../../context/usersContext";
import { EventContext } from "../../../context/eventContexts";
import CheckBoxComponent from "./small/checkBox";
import CheckBoxComponentContacts from "./small/sendSMS";
export default function AddFreinds() {
  const navigation = useNavigation();
  const [users, setUsers] = useState("");
  const { addFriends } = useContext(EventContext);
  const { getAllUsers, user } = useContext(UserContext);

  const scrollRef = useRef();
  const [usersSelected, setUsersSelected] = useState([]);

  const [contact, setContact] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [usersSelectedIndex, setUsersSelectedIndex] = useState([]);
  const [paginaitionIndex, setPaginationIndex] = useState(1);
  useEffect(() => {
    let x = async () => {
      let temp = [];

      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          let listOfUsers = await getAllUsers();

          let index = listOfUsers.findIndex((u) => u._id == user._id);
          listOfUsers.splice(index, 1);

          if (listOfUsers) {
            for (let i = 0; i < listOfUsers.length; i++) {
              for (let j = 0; j < listOfUsers.length; j++) {
                if (data[j]?.phoneNumbers[0]?.digits && data[j]?.phoneNumbers[0]?.digits == listOfUsers[i].phone) {
                  temp.push(j);
                } else if (data[j].phoneNumbers[0]?.number && data[j].phoneNumbers[0]?.number == listOfUsers[i].phone) {
                  temp.push(j);
                }
              }
            }
            console.log("-----");
            console.log(temp);
            for (let i = 0; i < temp.length - 1; i++) {
              for (let j = 0; j < temp.length - 1 - i; j++) {
                if (temp[j] > temp[j + 1]) {
                  let holder = temp[j];
                  temp[j] = temp[j + 1];
                  temp[j + 1] = holder;
                }
              }
            }

            for (let i = temp.length - 1; i >= 0; i--) {
              data.splice(temp[i], 1);
            }
            temp = [...listOfUsers, ...data];

            setContact(temp);
            setFilteredContacts(temp);
          }
        }
      }
    };
    x();
  }, []);

  useEffect(() => {
    if (!searchText) {
      setFilteredContacts(contact);
    } else {
      setFilteredContacts(contact.filter((person) => person.PhoneNumbers && (person.name.toLowerCase().includes(searchText.toLowerCase()) || person?.phoneNumbers[0].digits.toLowerCase().includes(searchText.toLowerCase()))));
    }
  }, [searchText]);

  const addUser = (id, index) => {
    let temp = usersSelected;

    if (!temp.includes(id) && id != user._id) {
      // indexTemp.push(index);
      temp.push(id);
      console.log(temp);
      setUsersSelected(temp);
      // setUsersSelectedIndex(indexTemp);
    }
  };

  const displayUsers = () => {
    let temp = filteredContacts.slice(50 * (paginaitionIndex - 1), 50 * paginaitionIndex);
    return temp.map((person, i) => {
      if (person.imageAvailable == "user") {
        return (
          <View style={styles.card} key={i}>
            <View style={styles.dits}>
              <TouchableOpacity onPress={() => addUser(person._id)}>
                <View
                  style={{
                    height: 65,
                    width: 65,
                    backgroundColor: COLORS.primary,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image source={{ uri: person.imageUrl }} style={{ width: 60, height: 60, borderRadius: "50%" }} />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  width: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.personName}>{person.name}</Text>
                {person.phone && <Text>{person.phone}</Text>}
              </View>
            </View>
            <CheckBoxComponent addUser={addUser} personId={person._id} />
          </View>
        );
      } else
        return (
          <View style={styles.card} key={i}>
            <View style={styles.dits}>
              <Image source={require("../../assets/blankAvatar.png")} style={{ width: 65, height: 65, borderRadius: "50%" }} />
              <View
                style={{
                  width: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.personName}>{person.name}</Text>
                {person.phoneNumbers ? person?.phoneNumbers[0]?.digits ? <Text>{person?.phoneNumbers[0]?.digits}</Text> : <Text>{person?.phoneNumbers[0]?.number}</Text> : ""}
              </View>
            </View>
            <CheckBoxComponentContacts />
          </View>
        );
    });
  };
  const submitUsers = async () => {
    let temp = usersSelected;
    temp.push(user._id);

    let result = await addFriends(temp);

    if (result) navigation.navigate(ROUTES.PICK_RES);
    else console.log("users wasnt sent");
  };
  return (
    <View style={styles.container}>
      <Button title="create" onPress={submitUsers} />
      <View style={styles.searchContainer}>
        <Input value={searchText} onChangeText={setSearchText} placeholder="Search by name or number" inputContainerStyle={styles.searchInput} />
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.inviteAfter}
            onPress={() => {
              setPaginationIndex(paginaitionIndex - 1);
            }}
          >
            <Text style={styles.uninviteButText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.inviteAfter}
            onPress={() => {
              setPaginationIndex(paginaitionIndex + 1);
            }}
          >
            <Text style={styles.uninviteButText}>Next</Text>
          </TouchableOpacity>
        </View>
        {filteredContacts ? displayUsers() : ""}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "center",
    height: 70,
    width: "100%",
    borderColor: "grey",
    borderWidth: 1,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dits: {
    display: "flex",
    flexDirection: "row",
    width: "50%",
  },
  personName: {
    fontSize: 21,
    textAlign: "center",
    color: COLORS.gray,

    fontWeight: "bold",
  },
  check: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  inviteAfter: {
    width: "20%",
    borderRadius: "5%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  uninviteButText: {
    color: COLORS.gray,
    fontSize: 18,
    fontWeight: "600",
  },
  searchContainer: {
    marginBottom: "-5%",
  },
});
