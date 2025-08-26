<template>
  <v-card width="100%">
    <v-table>
      <thead>
      <tr>
        <th class="text-left">
          Game ID
        </th>
        <th class="text-left">
          Player 1
        </th>
        <th class="text-left">
          createdAt
        </th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="item in desserts"
        :key="item.name"
      >
        <td>{{ item.id }}</td>
        <td>{{ item.player1 }}</td>
        <td>{{ cverDate(item.createdAt)}}</td>
        <td><v-btn color="green">Join Game</v-btn></td>
      </tr>
      </tbody>
    </v-table>

    <div class="text-center pa-2">
      <v-btn color="blue" size="x-large">Create Game</v-btn>
    </div>
  </v-card>


</template>
<script setup>
const desserts = [
  {
    id: 1,
    player1 : '0x03F133D02DC1C44401B8E67f7B394677EaCAFfAf',
    player1Move : ' 0x99a7d48c314beb7c1ce881a85b05d7782f7c22d5bf000000000000aa36a70200',
    createdAt: 1755598176,
    player2:  null,
    player2Move: null,
  },
  {
    id: 2,
    player1 : '0x03F133D02DC1C44401B8E67f7B394677EaCAFfAf',
    player1Move : ' 0x99a7d48c314beb7c1ce881a85b05d7782f7c22d5bf000000000000aa36a70200',
    createdAt: 1755998176,
    player2:  null,
    player2Move: null,
  },
]
function cverDate(i){

  return new Date(i * 1000).toLocaleDateString()
}
</script>
<style scoped>
.v-card {
  max-width: 1200px;
}
</style>
