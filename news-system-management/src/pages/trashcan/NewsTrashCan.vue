<template>
  <v-card>
    <v-card-title>
      <v-btn color="error" @click="batchDeletion">批量删除</v-btn>
      <v-btn color="success" @click="batchReduction">批量还原</v-btn>
      <v-spacer></v-spacer>
      <v-flex xs3>
        <v-text-field label="新闻搜索" v-model.lazy="search" append-icon="search" hide-details></v-text-field>
      </v-flex>
    </v-card-title>
    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="trashCanNews"
      :pagination.sync="pagination"
      :total-items="totalTrashCanNews"
      :loading="loading"
      class="elevation-1"
      item-key="id"
      select-all
      v-model="selected"
    >
      <template slot="items" slot-scope="props">
        <td>
          <v-checkbox v-model="props.selected" color="primary" hide-details></v-checkbox>
        </td>
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.title }}</td>
        <td class="text-xs-center">{{ props.item.categoryName }}</td>
        <td class="text-xs-center">
          {{props.item.status ? '已发布' : '未发布'}}
        </td>
        <td class="text-xs-center">{{ props.item.createTimeStr }}</td>
        <td class="text-xs-center">{{ props.item.updateTimeStr }}</td>

        <td class="justify-center layout px-0">
          <v-btn icon title="删除" @click="deleteNews(props.item.id)">
            <v-icon color="error">delete</v-icon>
          </v-btn>
          <v-btn icon title="还原" @click="reductionNews(props.item.id)">
            <v-icon color="success">home</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
    export default {
        name: "NewsTrashCan",
        data() {
          return {
            search: '',
            selected: [],
            headers: [
              {text: 'id', align: 'center', value: 'id', sortable: false},
              {text: '新闻标题', align: 'center', value: 'title', sortable: false},
              {text: '新闻分类', align: 'center', value: 'categoryName', sortable: false},
              {text: '新闻发布状态', align: 'center', value: 'status', sortable: false},
              {text: '新闻创建时间', align: 'center', value: 'createTime', sortable: true},
              {text: '新闻更新时间', align: 'center', value: 'updateTime', sortable: true},
              {text: '操作', align: 'center', sortable: false}
            ],
            totalTrashCanNews: 0, // 总条数
            trashCanNews: [], // 当前页品牌数据
            loading: true, // 是否在加载中
            pagination: {}, // 分页信息
          }
        },
        created() {
          this.loadNewsTrashCanData();
        },
        watch: {
          pagination: {
            deep: true,
            handler() {
              // 变化后的回调函数
              this.loadNewsTrashCanData();
            }
          },
          search: {
            handler() {
              this.pagination.page = 1;
              this.loadNewsTrashCanData();
            }
          }
        },
        methods: {
          deleteNews(id) {
            this.$message.confirm("确定永久删除该选项？").then(() => {
              this.$http.delete("/item/newsItem/delete/permanently/" + id).then(() => {
                this.$message.success("永久删除该选项成功");
                this.loadNewsTrashCanData();
              }).catch((err) => {
                console.log("永久删除选中选项失败, 异常信息为：", err);
                this.$message.error("永久删除该选项失败");
              });
            });
          },
          reductionNews(id) {
            this.$message.confirm("确定还原该选项").then(() => {
              this.$http.put("/item/newsItem/reduction/" + id).then(() => {
                this.$message.success("还原该选项成功");
                this.loadNewsTrashCanData();
              }).catch((err) => {
                console.log("还原选中选项失败, 异常信息为：", err);
                this.$message.error("还原该选项失败");
              });
            });
          },
          loadNewsTrashCanData() {
            this.$http.get("/item/newsItem/find/list", {
              params: {
                page: this.pagination.page,
                rows: this.pagination.rowsPerPage,
                key: this.search,
                sortBy: this.pagination.sortBy,
                desc: this.pagination.descending,
                isDelete: true
              }
            }).then(resp => {
              this.trashCanNews = resp.data.items;
              this.totalTrashCanNews = resp.data.total;
              this.loading = false;
            }).catch(err => {
              console.log("【垃圾箱】新闻信息加载失败，异常信息为：", err);
            });
          },
          batchDeletion() {
            if (this.selected.length == 0) {
              this.$message.error("请选择批量删除的选项");
            } else {
              this.$message.confirm("确定永久删除选中选项？").then(() => {
                let ids = [];
                for (let i=0; i<this.selected.length; i++) {
                  ids.push(this.selected[i].id);
                }
                this.$http.delete("/item/newsItem/delete/permanently/list/" + ids).then(() => {
                  this.$message.success("永久删除选中选项成功");
                  this.loadNewsTrashCanData();
                }).catch((err) => {
                  console.log("永久删除选中选项失败, 异常信息为：", err);
                  this.$message.error("永久删除选中选项失败");
                });
              });
            }
          },
          batchReduction() {
            if (this.selected.length == 0) {
              this.$message.error("请选择批量还原的选项");
            } else {
              this.$message.confirm("确定还原选中选项").then(() => {
                let ids = [];
                for (let i=0; i<this.selected.length; i++) {
                  ids.push(this.selected[i].id);
                }
                this.$http.put("/item/newsItem/reduction/list/" + ids).then(() => {
                  this.$message.success("还原选中选项成功");
                  this.loadNewsTrashCanData();
                }).catch((err) => {
                  console.log("还原选中选项失败, 异常信息为：", err);
                  this.$message.error("还原选中选项失败");
                });
              });
            }
          },
        },
    }
</script>

<style scoped>

</style>
