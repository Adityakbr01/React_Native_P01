import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "@/assets/icons";
import { useAuth } from "@/contexts/AuthContext";

const CommentItem = ({ item,canDelete=false,onDelete = () => {} }: { item: any,canDelete:boolean,onDelete: (item: any) => void }) => {
    const CreatedAt = moment(item?.created_at).fromNow();
    const {user} = useAuth();
    
    const handleDelete = () => {
        Alert.alert(
            "Confirm",
            "Are you sure you want to delete this comment?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Delete",
                onPress: () => {
                  onDelete(item);
                },
                style: "destructive",
              },
            ],
            { cancelable: false }
          );
    }
  return (
    <View style={styles.container}>
      <Avatar uri={item?.user?.image} />
      <View style={styles.content}>
        <View style={{flexDirection:"row", justifyContent:"space-between",alignItems:"center",gap:5}}>
            <View style={styles.nameContainer}>
                <Text style={styles.text}>{item?.user?.name}</Text>
                <Text style={[styles.text,{color:"#7C7C7C"}]}>{CreatedAt}</Text>
            </View>
            {
                canDelete && (
                    <TouchableOpacity onPress={handleDelete}>
                    <Icon name="delete" size={20} color={"#000"} />
                </TouchableOpacity>
                )
            }
        </View>
        <Text style={[styles.text,{fontWeight:"normal"}]}>
            {
                item?.text
            }
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  content: {
    backgroundColor: "rgba(0,0,0,0.05)",
    flex: 1,
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical:10,
    borderRadius: theme.radius.md,
    borderCurve:"continuous"
  },
  highlight:{
    borderWidth:0.2,
    backgroundColor:"white",
    borderColor:theme.colors.dark,
    shadowColor:theme.colors.dark,
    shadowOffset:{width:0,height:0.1},
    shadowOpacity:0.3,
    shadowRadius:8,
    elevation:5
  },
  nameContainer:{
    flexDirection:"row",
    alignItems:"center",
    gap:3
  },
  text:{
    fontSize:hp(1.6),
    color:theme.colors.textdark,
    fontWeight:theme.Fonts.medium as any
  }
});
