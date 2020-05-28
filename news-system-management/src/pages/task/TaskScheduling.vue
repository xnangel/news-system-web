<template>
  <v-card>
    <v-data-table :headers="headers" :items="taskArray"
      :total-items="total" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{props.item.id}}</td>
        <td class="text-xs-center">{{props.item.name}}</td>
        <td class="text-xs-center">{{props.item.time}}</td>
        <td class="text-xs-center">{{props.item.updateTime}}</td>
        <td class="text-xs-center">{{props.item.jobStatus == true ? '启动' : '停止'}}</td>
        <td class="text-xs-center">{{props.item.execute == true ? '已执行' : '未执行'}}</td>
        <td class="text-xs-center">
          <v-btn @click="changeTaskTime(props.item)">修改定时时间</v-btn>
        </td>
      </template>
    </v-data-table>

    <v-dialog max-width="400" v-model="show" persistent scrollable>
      <v-card>
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>Task</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeWindow"><v-icon>close</v-icon></v-btn>
        </v-toolbar>

        <v-card-text class="px-5">
          <v-layout row>
            <v-time-picker color="green lighten-1" :format="format" v-model="picker"></v-time-picker>
          </v-layout>
          <v-layout class="my-2" row>
            <v-spacer></v-spacer>
            <v-btn @click="submit">提交</v-btn>
            <v-btn @click="reset">重置</v-btn>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
    export default {
        name: "TaskScheduling",
        data() {
          return {
            headers: [
              {text: 'id', value: 'id', sortable: false, align: 'center'},
              {text: '名称', value: 'name', sortable: false, align: 'center'},
              {text: '每天执行时间', value: 'time', sortable: false, align: 'center'},
              {text: '修改时间', value: 'updateTime', sortable: false, align: 'center'},
              {text: '状态', value: 'jobStatus', sortable: false, align: 'center'},
              {text: '今日是否已执行', value: 'execute', sortable: false, align: 'center'},
              {text: '操作', sortable: false, align: 'center'}
            ],
            total: 0, // 任务条数
            taskArray: [],  // 任务集合
            show: false,
            format: '24hr',
            oldTask: {},
            picker: null,
          }
        },
        created() {
          this.loadData();
        },
        methods: {
          loadData() {
            this.$http.get("/webcrawler/task/find/list").then(resp => {
              this.taskArray = resp.data;
              this.total = this.taskArray.length;
            }).catch(err => {
              console.log("【任务调度管理】 任务列表数据获取失败，异常信息为：", err);
            });
          },
          changeTaskTime( obj ) {
            this.show = true;
            this.oldTask = obj;
            this.picker = this.oldTask.time;
          },
          closeWindow() {
            // 重新加载数据
            this.loadData();
            // 关闭窗口
            this.show = false;
          },
          submit() {
            if (this.picker && this.picker != this.oldTask.time) {
              this.$http.put("/webcrawler/task/update/cronExpression?id="+this.oldTask.id+"&cronExpression="+this.picker).then(() => {
                this.$message.success("定时时间修改成功，第二天正式开始执行该时间");
                this.closeWindow();
              }).catch(() => {
                this.$message.error("定时时间修改失败");
                this.show = false;
              });
            } else if (this.picker === this.oldTask.time) {
              this.$message.info("修改的定时时间和之前相同呦");
            } else {
              this.$message.error("修改的定时时间不能为空");
            }
          },
          reset() {
            this.picker = null;
          }
        }
    }
</script>

<style scoped>

</style>
