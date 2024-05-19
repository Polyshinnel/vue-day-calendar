<script setup>

import {ref} from "vue";
import CalendarItem from "@/components/calendar-item.vue";
import DraggableItem from "@/components/draggable-item.vue";
import CalendarTime from "@/components/CalendarTime.vue";

const userRecords = ref([]);

const freeZones = ref([
    {
        id: 1,
        height: '300px',
        top: '0px',
        item: {
            x: 0,
            y: 0,
            height: 15,
            width: 250,
            active: true
        }
    },
    {
        id: 2,
        height: '1050px',
        top: '390px',
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

const sortByKey = (array, key) => {
    return array.sort(function(a, b)
    {
        let x = a[key];
        let y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


const calculateFreeZone = () => {
    const lastZone = freeZones.value[freeZones.value.length - 1].id

    let zoneObj = {
        id: 2,
        height: '300px',
        top: '390px',
        item: {
            x: 0,
            y: 0,
            height: 15,
            width: 250,
            active: true
        }
    }

    let zoneList = [];

    if(orderCart) {
        orderCart.forEach((order) => {
            const obj = {
                top: order.timeStart,
                height: order.timeDuration
            }
            zoneList.push(obj)
        })
    }

    if(recordList) {
        recordList.forEach((record) => {
            const obj = {
                top: parseInt(record.y),
                height: parseInt(record.height)
            }
            zoneList.push(obj)
        })
    }

    zoneList = sortByKey(zoneList, top)

    console.log(zoneList)
}

const handleData = (dataObj) => {
    const index = orderCart.findIndex(x => x.id === dataObj.value.id)
    if(index === -1) {
        orderCart.push(dataObj.value)
    } else {
        orderCart[index] = dataObj.value
    }

    calculateFreeZone()
}


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
        </div>
    </div>

</template>

<style>
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
