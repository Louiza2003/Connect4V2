<template>
  <div class="bg-white space-y-2">

    <!-- Numéros des colonnes -->
    <div
      class="grid text-center font-bold text-gray-700"
      :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }"
    >
      <div v-for="col in cols" :key="col">
        {{ col }}
      </div>
    </div>

    <!-- Game Grid -->
    <div
      class="grid gap-2"
      :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }"
    >
      <Cell
        v-for="a in totalCells"
        :key="a"
        :col="(a - 1) % cols"
        :row="Math.floor((a - 1) / cols)"
        :boardValue="board[Math.floor((a - 1) / cols)][(a - 1) % cols]"
        @cell-clicked="fillColumn"
      />
    </div>

  </div>
</template>


<script setup>
import { computed } from 'vue';
import Cell from './Cell.vue';
import { useGame } from '../composables/useGame';
const props = defineProps({
   board: {
      type: Array,
   },
   boardSize: {
      type: Object,
   }
})

console.log(props.board);
console.log(props.boardSize);
const rows = props.boardSize.rows;
const cols = props.boardSize.cols
const totalCells = computed(() => cols * rows)
const {fillCol} = useGame();

const fillColumn = (col) => {
   fillCol(col);
   console.log('col is filled', col);
   
}

</script>