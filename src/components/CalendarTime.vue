<script setup>
let timeList = [];
let startPos = 0;
for(let i = 0; i < 24; i++) {
    let timeStr = '';
    if(startPos.length < 2) {
        timeStr = `0${startPos}:00`
    } else {
        timeStr = `${startPos}:00`
    }
    let timeObj = {
        id: startPos,
        str: timeStr
    }
    timeList.push(timeObj)
    startPos++;
}
</script>

<template>
    <ul class="calendar-count">
        <li v-for="timeItem in timeList" :key="timeItem.id">{{timeItem.str}}</li>
    </ul>
</template>

<style scoped>
.calendar-count{
    margin: 0;
    padding: 0;
    list-style: none;
}

.calendar-count li{
    height: 15px;
    display: flex;
    align-items: center;
    margin-top: 2px;
}

.calendar-count li + li{
    margin-top: 45px;
}
</style>