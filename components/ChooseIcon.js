import { View, Text, PanResponder, StyleSheet, Dimensions, ScrollView, Image, Pressable } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import * as DB from '../settings/SQLite/query'

const DraggableBar = ({ value, setValue, barWidth, draggableWidth }) => {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { moveX } = gestureState;

        // Oblicz nową pozycję drag z uwzględnieniem offsetu
        let newPosition = Math.max(0, Math.min(barWidth - draggableWidth, moveX - draggableWidth / 2));
        const newValue = Math.round((newPosition / (barWidth - draggableWidth)) * 255);
        setValue(newValue);
      },
    })
  ).current;

  return (
    <View style={styles.bar}>
      <View
        {...panResponder.panHandlers}
        style={[styles.draggable, { left: (value / 255) * (barWidth - draggableWidth) }]}
      />
    </View>
  );
};

const ChooseIcon = (props) => {
    const rgbValues = props.color.match(/\d+/g).map(Number);
    const [valueR, setValueR] = useState(rgbValues[0]);
    const [valueG, setValueG] = useState(rgbValues[1]);
    const [valueB, setValueB] = useState(rgbValues[2]);
    const [RGBValue, setRGBValue] = useState('rgb('+valueR+','+valueG+','+valueB+')');
    const barWidth = Dimensions.get('window').width * 0.9; // 90% szerokości ekranu
    const draggableWidth = 40;
    const [allIcon, setAllIcon] = useState(DB.selectValueFromColumnCondition('icon', '*', '1=1 ORDER BY Type'));
    const [previousType, setPreviousType] = useState(-1);

    useEffect(() => {
        setRGBValue('rgb('+valueR+','+valueG+','+valueB+')');
    }, [valueR, valueG, valueB])

  return (
    <View style={styles.container}>
    <View style={{...styles.colorHolder, backgroundColor: RGBValue, marginTop: 10}} />
    <View style={styles.row}>
        <DraggableBar
            value={valueR}
            setValue={setValueR}
            barWidth={barWidth}
            draggableWidth={draggableWidth}
        />
    </View>
    <View style={styles.row}>
        <DraggableBar
            value={valueG}
            setValue={setValueG}
            barWidth={barWidth}
            draggableWidth={draggableWidth}
        />
    </View>
    <View style={styles.row}>
        <DraggableBar
            value={valueB}
            setValue={setValueB}
            barWidth={barWidth}
            draggableWidth={draggableWidth}
        />
    </View>
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
    backgroundColor: '#000000F0',
    justifyContent: 'flex-start',
    alignItems: 'center' ,
    zIndex: 1,
  },
  colorHolder: {
    width: 120,
    height: 120,
    borderRadius: 100
  },
  row: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  bar: {
    width: '90%',
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
    position: 'relative',
  },
  draggable: {
    width: 40,
    height: 20,
    backgroundColor: 'black',
    borderRadius: 10,
    position: 'absolute',
  }
});

export default ChooseIcon;
