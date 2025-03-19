import { View, Text } from 'react-native'
import PagerView from 'react-native-pager-view'
import BarGraph from './BarGraph'
import React from 'react'
import * as GF from '../settings/GlobalFunction'
import AntDesign from '@expo/vector-icons/AntDesign';

const PagerViewIndex = (props) => {
    const sumExp = props.categoryList.reduce((sum, item) => (item.Type==1 ? sum+=item.suma : sum), 0).toFixed(2);
    const sumInc = props.categoryList.reduce((sum, item) => (item.Type==2 ? sum+=item.suma : sum), 0).toFixed(2);

    return (
        <PagerView initialPage={0} style={{width: '100%', height: 115}} onPageSelected={(e) => props.setOpenPageOfView(e.nativeEvent.position)}>
            <View key={0} style={{justifyContent: 'center', alignItems: 'center'}}>
                {props.analitycsChart.map((item, index) => {
                    return <BarGraph item={item} key={index} />
                })}
            </View>
            <View key={1} style={{justifyContent: 'center', alignItems: 'center'}}>
                {sumExp>0 && (
                    <>
                    <View style={{marginBottom: 5, flexDirection: 'row', alignItems: 'center', gap: 5}}>
                        <View style={{backgroundColor: 'rgb(138, 28, 28)', padding: 2, borderRadius: 20}}>
                            <AntDesign name='arrowdown' size={15} color='white' />
                        </View>
                        <Text style={{color: 'white', fontWeight: '500'}}>{sumExp} PLN</Text>
                    </View>
                    <View style={{backgroundColor: '#121417', width: '85%', height: 25, borderRadius: 20, overflow: 'hidden', flexDirection: 'row'}}>
                        {props.categoryList.map((item, index) => {
                            if(item.Type==1){
                                return (
                                    <View key={index} style={{width: ((item.suma*100)/sumExp)+'%', backgroundColor: GF.convertColor(item.Color, 'BB'), height: '100%'}} />
                                )
                            }
                        })}
                    </View>
                    </>
                )}
                {sumInc>0 && (
                    <View style={{marginTop: 7, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{marginBottom: 5, flexDirection: 'row', alignItems: 'center', gap: 5}}>
                        <View style={{backgroundColor: 'rgb(30, 132, 52)', padding: 2, borderRadius: 20}}>
                            <AntDesign name='arrowup' size={15} color='white' />
                        </View>
                        <Text style={{color: 'white', fontWeight: '500'}}>{sumInc} PLN</Text>
                    </View>
                    <View style={{backgroundColor: '#121417', width: '85%', height: 25, borderRadius: 20, overflow: 'hidden', flexDirection: 'row'}}>
                        {props.categoryList.map((item, index) => {
                            if(item.Type==2){
                                return (
                                    <View key={index} style={{width: ((item.suma*100)/sumInc)+'%', backgroundColor: GF.convertColor(item.Color, 'BB'), height: '100%'}} />
                                )
                            }
                        })}
                    </View>
                    </View>
                )}
            </View>
        </PagerView>
    )
}

export default PagerViewIndex