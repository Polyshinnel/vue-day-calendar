<script setup>
import {DraggableResizableContainer, DraggableResizableVue} from 'draggable-resizable-vue3'
import {ref, watch} from "vue";

const props = defineProps({
    container_info: "object"
})

const emits = defineEmits([
    'customChange'
])


const time_start = ref(props.container_info.item.y);
const time_duration = ref(15)
const visibleItem = ref(false)

const startTimeStr = ref('')
const endTimeStr = ref('')

const normalizeDate = (date) => {
    let minutes = date.getMinutes()
    let hours = date.getHours()

    let strMinutes = (minutes < 10) ? `0${minutes}` : `${minutes}`
    let strHours = (hours < 10) ? `0${hours}` : `${hours}`
    return `${strHours}:${strMinutes}`
}

const calculateData = (time_start, time_duration, offset) => {
    let currTime = new Date('2024-05-19T00:00:00.000Z')
    const millisecondsSince1970 = currTime.getTime()
    const startContainerMinutes = parseInt(offset)

    const newMilliseconds = millisecondsSince1970 + (time_start.value * 60000) - (180*60000) + (startContainerMinutes * 60000)
    const endMilliseconds = newMilliseconds + (time_duration.value * 60000)

    let newDate = new Date(newMilliseconds)
    let endDate = new Date(endMilliseconds)

    let startTimeStr = normalizeDate(newDate)
    let endTimeStr = normalizeDate(endDate)

    return {
        statTime: startTimeStr,
        endTime: endTimeStr
    }
}


watch(time_start, () => {
    const dateInfo = calculateData(time_start, time_duration, props.container_info.top)
    startTimeStr.value = dateInfo.statTime
    endTimeStr.value = dateInfo.endTime
})

watch(time_duration, () => {
    const dateInfo = calculateData(time_start, time_duration, props.container_info.top)
    startTimeStr.value = dateInfo.statTime
    endTimeStr.value = dateInfo.endTime
})


const clickEvent = ($event) => {
    if(!visibleItem.value) {
        const cordY = $event.offsetY
        const divider = Math.floor(cordY / 15)
        time_start.value = 15 * divider
        visibleItem.value = true
    }

    const dateInfo = calculateData(time_start, time_duration, props.container_info.top)
    startTimeStr.value = dateInfo.statTime
    endTimeStr.value = dateInfo.endTime
}


const acceptRecord = () => {
    const timeObj = ref({
        id: props.container_info.id,
        timeStart: time_start.value,
        timeDuration: time_duration.value,
        active: visibleItem.value,
        offset: parseInt(props.container_info.top),
        startTime: startTimeStr.value,
        endTime: endTimeStr.value
    })

    emits('customChange', timeObj)
}

</script>

<template>
    <draggable-resizable-container
            @click="clickEvent($event)"
            class-name="resize-container"
            :style="{height: props.container_info.height, top: props.container_info.top}"
            :grid="[15,15]"
            :show-grid="false"
    >
        <draggable-resizable-vue
                v-if="visibleItem"
                v-model:x="props.container_info.item.x"
                v-model:y="time_start"
                v-model:h="time_duration"
                v-model:w="props.container_info.item.width"
                v-model:active="props.container_info.item.active"
                axis="y"
                :min-height="15"
                :handles="['tm','bm']"
                class="current-calendar-record"
        >
            <div class="accept-calendar-record" @click="acceptRecord">
                <p>Ок</p>
            </div>
            timeStart={{ startTimeStr }}<br />
            timeEnd={{ endTimeStr }}<br />
        </draggable-resizable-vue>
    </draggable-resizable-container>
</template>

<style scoped>
.resize-container{
    width: 100%;
    background: #aaa;
    position: absolute !important;
    left: 0;

    background: linear-gradient(-90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0 0 / 0 0, linear-gradient(0deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0 0 / 60px 60px; height: 200px; top: 0;
}

.current-calendar-record{
    background: #fff;
}

.accept-calendar-record{
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 15px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>