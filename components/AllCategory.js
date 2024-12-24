import { View, Text, Pressable, Image, ScrollView } from 'react-native'
import React from 'react'

const AllCategory = (props) => {

    function changeCategory(catId){
        props.cateId(catId);
        props.off(false);
    }

    return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center'}} style={{position: 'absolute', width: '100%', height: '100%', zIndex: 1, backgroundColor: '#000000B0'}}>
    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        {props.value.map((row) => {
        return(
        <View style={{width: '90%', backgroundColor: '#414449', marginBottom: 15, borderRadius: 10}} key={row.Id}>
            <Pressable onPress={() => changeCategory(row.Id)} style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5}}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: `${row.Color}`, width: 50, height: 50, borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}>
                        <Image
                            source={{ uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+row.Picture }}
                            style={{ width: 30, height: 30}}
                        />
                    </View>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: '600', marginLeft: 20}}>{row.Name}</Text>
                </View>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                </View>
            </Pressable>
        </View> 
        )})}
    </View>
    </ScrollView>
    )
}

export default AllCategory