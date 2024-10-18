import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

const RichTextEditor = ({ editorRef, onChange }: { editorRef: React.RefObject<RichEditor>, onChange: (text: string) => void }) => {
  return (
    <View style={{ minHeight: 310, borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: "#ddd" }}>
      <RichToolbar
        editor={editorRef}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.heading1,
          actions.heading2,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.removeFormat,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.setSubscript,
          actions.setSuperscript,
          actions.insertImage,
          actions.insertLink,
        ]}
        style={styles.richBar}
        flatContainerStyle={styles.listStyle}
        iconMap={{
          [actions.heading1]: ({ tintColor }: { tintColor: string }) => <Text style={{ color: tintColor }}>H1</Text>,
          [actions.heading2]: ({ tintColor }: { tintColor: string }) => <Text style={{ color: tintColor }}>H2</Text>,
        }}
      />
      <RichEditor
        ref={editorRef}
        onChange={onChange}
        style={styles.richEditor}
        placeholder="Write your post here..."
      />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  richEditor: {
    flex: 1,
    padding: 6,
    fontSize: 16,
    borderRadius: 10,
  },
  richToolbar: {
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  richBar: {
    backgroundColor: theme.colors.gray,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginBottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    flexDirection: "row",
    
  },
  listStyle: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    gap: 2
  },
});
