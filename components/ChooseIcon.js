import { View, Text, PanResponder, StyleSheet, Dimensions, ScrollView, Image, Pressable } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as DB from '../settings/SQLite/query'

const ChooseIcon = (props) => {
    const rgbValues = props.color.match(/\d+/g).map(Number);
    const [valueR, setValueR] = useState(rgbValues[0]);
    const [valueG, setValueG] = useState(rgbValues[1]);
    const [valueB, setValueB] = useState(rgbValues[2]);
    const [RGBValue, setRGBValue] = useState('rgb('+valueR+','+valueG+','+valueB+')');
    const [allIcon, setAllIcon] = useState(DB.selectValueFromColumnCondition('icon', '*', '1=1 ORDER BY Type'));
    const items = [];

    for(let r=0; r<=255; r+=51){
      for(let g=0; g<=255; g+=35){
        for(let b=0; b<=255; b+=20){
          items.push(<Pressable onPress={() => setRGBValue(`rgb(${r},${g},${b})`)} key={`${r}-${g}-${b}`} style={{...styles.colorPicker, backgroundColor: `rgb(${r},${g},${b})`}}>{RGBValue==`rgb(${r},${g},${b})` && <AntDesign name="check" size={20} color="white" />}</Pressable>);
        }
      }
    }

  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={{flexDirection: 'column', flexWrap: 'wrap', gap: 10}} style={styles.pagerView} horizontal={true}>
        {items}
    </ScrollView>
    <ScrollView contentContainerStyle={{ flexWrap: 'wrap', gap: 11, flexDirection: 'row', justifyContent: 'space-around' }} style={{ width: '90%' }}>
        {allIcon.map((item, index) => {
            const previousType = index > 0 ? allIcon[index - 1].Type : null;
            return (
            <React.Fragment key={item.Id}>
                {item.Type != previousType && (
                <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: 'white', marginTop: 10, alignItems: 'center' }}>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: '500'}}>{DB.selectValueFromColumnCondition('iconType', 'name'+props.lang+' as '+props.lang, 'Id='+item.Type)[0][props.lang]}</Text>
                </View>
                )}
                <Pressable onPress={() => {props.onChangeIcon(item.Id); props.onChangeColor(RGBValue); props.onClose(false)}} style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: RGBValue, justifyContent: 'center', alignItems: 'center'}}>
                <Image
                    source={{ uri: process.env.EXPO_PUBLIC_API_URL + 'IMG/' + (DB.selectValueFromColumnCondition('icon', 'Picture', 'id='+item.Id)[0].Picture) }}
                    style={{ width: 30, height: 30 }}
                />
                </Pressable>
            </React.Fragment>
            );
        })}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    justifyContent: 'flex-start',
    alignItems: 'center' ,
    zIndex: 1
  },
  colorsHolder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  colorPicker: {
    height: 30, 
    width: 30, 
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pagerView: {
    width: '90%',
    height: 200
  }
});

export default ChooseIcon;
