<script setup>
import { reactive } from "vue";
import { UserOutlined, InfoCircleOutlined } from "@ant-design/icons-vue";
import { useInjectState } from "../state";
let { tempAccount } = useInjectState();
const emit = defineEmits(["add", 'clearAll']);

function onFinish() {
  emit('add', {...tempAccount});
  tempAccount.address = '';
}
</script>
  <template>
  <div style="padding: 5px;">
    <a-form  :model="tempAccount" autocomplete="off" @finish="onFinish">
      <a-form-item
        label="Adress"
        name="Adress"
      >
        <a-input v-model:value="tempAccount.address" />
      </a-form-item>
      <!-- <a-form-item label="tag" name="tag">
        <a-input v-model:value="tempAccount.tag" />
      </a-form-item> -->
      <a-form-item >
        <a-button type="primary" html-type="submit">添加</a-button>
        <a-button type="primary" danger @click="emit('clearAll')" style="float:right;">删除所有地址</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
  .read-the-docs {
    color: #888;
  }
  .ant-form-item {
    margin-bottom: 5px;
  }
</style>
