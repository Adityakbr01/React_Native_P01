import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";


const RichTextEditor = (
  { onChange }: { onChange: any },
  { editorRef }: any
) => {




  return (
    <View style={{ minHeight: 300 }}>
      <RichToolbar
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertImage,
          actions.insertLink,
          actions.setStrikethrough,
          actions.insertOrderedList,
          actions.insertBulletsList,
          actions.setSubscript,
          actions.setSuperscript,
          actions.removeFormat,
        ]}
        style={styles.richBar}
        flatContainerStyle={styles.listStyle}
        editor={editorRef}
        disableToolbar={false}
      />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  richEditor: {
    flex: 1,
    minHeight: 300,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
  },
  richToolbar: {
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  richBar: {},
  listStyle: {},
});
