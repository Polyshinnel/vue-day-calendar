<script setup>
import {ref} from "vue";
import CalendarItem from "@/components/CalendarDay/CalendarItem.vue";
import DraggableItem from "@/components/CalendarDay/DraggableItem.vue";
import CalendarTime from "@/components/CalendarDay/CalendarTime.vue";
import CalendarUserEventItem from "@/components/CalendarDay/CalendarUserEventItem.vue";


const userRecords = ref([]);

const freeZones = ref([
    {
        id: 1,
        height: '1440px',
        top: '0px',
        item: {
            x: 0,
            y: 0,
            height: 15,
            width: 250,
            active: true
        }
    },
]);

const recordList = [
    {
        y: "300px",
        height: "90px",
        title: "Стрижка",
        name: "Иванов Иван"
    }
]

let orderCart = [];

const userEventList = ref([]);

const sortByKey = (array, key) => {
    return array.sort(function(a, b)
    {
        let x = a[key];
        let y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
const getFreeZoneList = (busyZoneList) => {
    let freeZonesArr = [];
    const lastZone = freeZones.value[freeZones.value.length - 1].id
    const startInterval = 0;
    const endInterval = 1440;
    let validateBusyZone = [];

    //Отбрасываем те участки которые
    // уже в прошлом(т.е не надо делать интервалы там, где время уже прошло
    for(let i = 0; i < busyZoneList.length; i++) {
        let bottom = busyZoneList[i]['top'] + busyZoneList[i]['height']
        if(bottom > startInterval) {
            validateBusyZone.push(busyZoneList[i])
        }
    }

    if(validateBusyZone.length > 0) {
        //Проверка если только 1 интервал
        if(validateBusyZone.length === 1) {
            if(validateBusyZone[0]['top'] > startInterval) {
                let top = 0;
                let height = validateBusyZone[0]['top']
                let dataObjTop = {
                    top: top,
                    height: height
                }
                freeZonesArr.push(dataObjTop)
            }

            let lastIntervalBottom = validateBusyZone[0]['top'] + validateBusyZone[0]['height']
            if(lastIntervalBottom < endInterval) {
                let height = endInterval - lastIntervalBottom
                let lastDataObj = {
                    top: lastIntervalBottom,
                    height: height
                }
                freeZonesArr.push(lastDataObj)
            }
        }

        //Проверка при наличии больше 1 интервала
        if(validateBusyZone.length > 1) {
            //Проверяем расстояние от первого интервала до ограничения
            if(validateBusyZone[0]['top'] > startInterval) {
                let top = 0;
                let height = validateBusyZone[0]['top']
                let dataObjTop = {
                    top: top,
                    height: height
                }
                freeZonesArr.push(dataObjTop)
            }


            //Выкалываем первый и последний интервал
            for(let i = 1; i < validateBusyZone.length; i++) {
                let prevBottom = validateBusyZone[i - 1]['top'] + validateBusyZone[i - 1]['height']
                let top = validateBusyZone[i]['top']
                let height = top - prevBottom
                if(height > 0) {
                    let dataObj = {
                        top: prevBottom,
                        height: height
                    }
                    freeZonesArr.push(dataObj)
                }
            }

            //Проверяем расстояние от последнего интервала до окончания
            let lastIntervalBottom = validateBusyZone[validateBusyZone.length - 1]['top'] + validateBusyZone[validateBusyZone.length - 1]['height']
            if(lastIntervalBottom < endInterval) {
                let height = endInterval - lastIntervalBottom
                let lastDataObj = {
                    top: lastIntervalBottom,
                    height: height
                }
                freeZonesArr.push(lastDataObj)
            }
        }
    }
    return freeZonesArr;
}
const calculateBusyZone = () => {
    let busyZoneList = [];

    if(orderCart) {
        orderCart.forEach((order) => {
            const obj = {
                top: order.timeStart,
                height: order.timeDuration
            }
            busyZoneList.push(obj)
        })
    }

    if(recordList) {
        recordList.forEach((record) => {
            const obj = {
                top: parseInt(record.y),
                height: parseInt(record.height)
            }
            busyZoneList.push(obj)
        })
    }

    busyZoneList = sortByKey(busyZoneList, 'top')
    return busyZoneList
}

const updateUserEventList = () => {
    let eventObjList = [];
    if(orderCart) {
        orderCart.forEach((orderItem) => {
            let top = orderItem.timeStart
            let id = orderItem.id
            let height = orderItem.timeDuration

            const obj = {
                id: id,
                top: `${top}px`,
                height: `${height}px`,
                timeStart: orderItem.startTime,
                timeEnd: orderItem.endTime
            }

            eventObjList.push(obj)
        })
    }

    if(eventObjList) {
        userEventList.value = eventObjList
    }
}

const updateFreeZones = () => {
    const busyZones = calculateBusyZone()
    const freeZonesRaw = getFreeZoneList(busyZones)
    let updatedFreeZonesArr = [];

    let lastZoneId = freeZones.value[freeZones.value.length - 1].id
    freeZonesRaw.forEach((freeZone) => {
        lastZoneId++
        let zoneObj = {
            id: lastZoneId,
            height: `${freeZone.height}px`,
            top: `${freeZone.top}px`,
            item: {
                x: 0,
                y: 0,
                height: 15,
                width: 250,
                active: true
            }
        }
        updatedFreeZonesArr.push(zoneObj)
    })

    freeZones.value = updatedFreeZonesArr
}
const handleData = (dataObj) => {
    const index = orderCart.findIndex(x => x.id === dataObj.value.id)
    if(index === -1) {
        dataObj.value.timeStart = dataObj.value.timeStart + parseInt(dataObj.value.offset)
        orderCart.push(dataObj.value)
    } else {
        orderCart[index] = dataObj.value
    }

    updateFreeZones()
    updateUserEventList()
}

const deleteEvent = (id) => {
    orderCart = orderCart.filter((x) => x.id !== id)
    updateFreeZones()
    updateUserEventList()
}

updateFreeZones()
</script>

<template>
    <div class="calendar-day-block">
        <CalendarTime/>
        <div class="calendar-grid">
            <draggable-item v-for="freeZone in freeZones" :key="freeZone.height" :container_info="freeZone" @customChange="handleData"/>
            <calendar-item
                    v-if="recordList"
                    v-for="recordItem in recordList"
                    :key = "recordItem.y"
                    :y="recordItem.y"
                    :height="recordItem.height"
                    :title="recordItem.title"
                    :name="recordItem.name"
            />
            <calendar-user-event-item v-if="userEventList" v-for="userEventItem in userEventList" :event-data="userEventItem" :key="userEventItem.id" @deleteItem="deleteEvent" />
        </div>
    </div>
</template>

<style scoped>
.calendar-day-block{
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 20px;
}
.calendar-grid{
    width: 250px;
    height: 1440px;
    background: #e8e8e8;
    position: relative;
    border: 3px solid #ff0000;
}
</style>