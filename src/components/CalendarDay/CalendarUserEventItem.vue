<script setup>
const props = defineProps({
    eventData: Object
})

const emits = defineEmits([
    'deleteItem'
])

const deleteEvent = (id) => {
    emits('deleteItem', id)
}
</script>

<template>
  <div class="userEventItem" :style="{height:props.eventData.height, top: props.eventData.top}">
      <div class="delete-block" @click="deleteEvent(props.eventData.id)">
          <p>Удалить</p>
      </div>
      <p>{{props.eventData.timeStart}} - {{props.eventData.timeEnd}}</p>
  </div>
</template>

<style scoped>
.userEventItem{
    position: absolute;
    background: aqua;
    left: 0;
    width: 100%;
}

.delete-block{
    position: absolute;
    top: 5px;
    right: 5px;
    width: 70px;
    height: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #fff;
}
</style>