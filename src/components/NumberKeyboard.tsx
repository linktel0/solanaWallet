import { Text, TouchableOpacity, View } from "react-native";

const words = ['1','2','3','4','5','6','7','8','9','.','0','←']
interface porps {
  onPress:(num:string) => void,
}
const NumberKeyboard = ({ onPress }:porps) => (
  <View className={`w-full justify-center  bg-indigo-300 dark:bg-slate-800`}>
    {
      words.slice(0,4).map((temp,i)=>{
        return(
          <View key={i} className={`flex-row justify-between mx-5`}>
             { words.slice(3*i,3*(i+1)).map((word,j)=>{                    
                return(
                  <View key={3*i+j} className={`mx-8 my-1`}>
                    <TouchableOpacity onPress={() => onPress(word)} 
                      className={`items-center justify-center w-14 h-14 rounded-full  bg-indigo-500 dark:bg-slate-500 `}>
                      <Text className={` text-slate-900 dark:text-slate-300 text-xl`}>
                        {word}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
          </View>
        )
      })
    }
  </View>
);

export default NumberKeyboard;



/*
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


const NumberKeyboard = ({ number, onPress, pin }) => (
  <View style={styles.container}>
    <View style={styles.pinContainer}>
      <View
        style={[
          styles.pinIndicator,
          pin.length > 0 ? styles.pinIndicatorActive : undefined,
        ]}
      ></View>
      <View
        style={[
          styles.pinIndicator,
          pin.length > 1 ? styles.pinIndicatorActive : undefined,
        ]}
      ></View>
      <View
        style={[
          styles.pinIndicator,
          pin.length > 2 ? styles.pinIndicatorActive : undefined,
        ]}
      ></View>
      <View
        style={[
          styles.pinIndicator,
          pin.length > 3 ? styles.pinIndicatorActive : undefined,
        ]}
      ></View>
    </View>
    <View style={styles.row}>
      <TouchableOpacity onPress={() => onPress('1')} style={styles.button}>
        <Text style={styles.text}>1</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress('2')} style={styles.button}>
        <Text style={styles.text}>2</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress('3')} style={styles.button}>
        <Text style={styles.text}>3</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.row}>
      <TouchableOpacity onPress={() => onPress('4')} style={styles.button}>
        <Text style={styles.text}>4</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress('5')} style={styles.button}>
        <Text style={styles.text}>5</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress('6')} style={styles.button}>
        <Text style={styles.text}>6</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.row}>
      <TouchableOpacity onPress={() => onPress('7')} style={styles.button}>
        <Text style={styles.text}>7</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress('8')} style={styles.button}>
        <Text style={styles.text}>8</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress('9')} style={styles.button}>
        <Text style={styles.text}>9</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.row}>
        <Text style={{ width: 60, height:60,}}></Text>
        <TouchableOpacity onPress={() => onPress('0')} style={styles.button}>
          <Text style={styles.text}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPress('←')} style={styles.button}>
          <Text style={styles.text}>←</Text>
        </TouchableOpacity>
    </View>
  </View>
);

export default NumberKeyboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    width: "100%",

  },
  pinContainer: {
    flexDirection: "row",
    width: 150,
    marginBottom: 20,
    alignSelf: "center",
    justifyContent: "space-between",
  },
  pinIndicator: {
    borderWidth: 2,
    borderColor: "#ffffff",
    width: 20,
    height: 20,
    // backgroundColor: "#fff",
    borderRadius: 10,
  },
  pinIndicatorActive: {
    backgroundColor: "#fff",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  rowLast: {
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 28,
  },
  text: {
    color: "#000000",
    fontSize: 20,
  },
});
*/