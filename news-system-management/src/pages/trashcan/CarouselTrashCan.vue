<template>
  <v-card>
    <v-card-title>
      <v-btn color="error" @click="batchDeletionCarousel">批量删除</v-btn>
      <v-btn color="success" @click="batchReductionCarousel">批量还原</v-btn>
      <v-spacer></v-spacer>
      <v-flex xs3>
        <v-text-field label="轮播图新闻搜索" v-model.lazy="search" append-icon="search" hide-details></v-text-field>
      </v-flex>
    </v-card-title>
    <v-divider></v-divider>

    <v-data-table :headers="headers" :items="carouselNews"
                  :pagination.sync="pagination" :total-items="totalCarouselNews"
                  :loading="loading" class="elevation-1"
                  v-model="selected" select-all item-key="id">
      <template slot="items" slot-scope="props">
        <td>
          <v-checkbox v-model="props.selected" color="primary" hide-details></v-checkbox>
        </td>
        <td class="text-xs-center">{{props.item.id}}</td>
        <td class="text-xs-center">{{props.item.categoryName}}</td>
        <td class="text-xs-center">{{props.item.title}}</td>
        <td class="text-xs-center">
          <img :src="props.item.imageUrl" height="100px">
        </td>
        <td class="text-xs-center">
          <v-btn icon title="删除" @click="deleteCarousel(props.item.id)">
            <v-icon color="error">delete</v-icon>
          </v-btn>
          <v-btn icon title="还原" @click="reductionCarousel(props.item.id)">
            <v-icon color="success">home</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
    export default {
        name: "CarouselTrashCan",
        data() {
          return {
            search: '',
            carouselNews: [], // 轮播图新闻集合
            totalCarouselNews: 0, // 轮播图新闻集合条数
            loading: true,  // 是否在加载中
            pagination: {}, // 分页信息
            headers: [
              {text: 'id', value: 'id', sortable: false, align: 'center'},
              {text: '分类', value: 'categoryName', sortable: false, align: 'center'},
              {text: '标题', value: 'title', sortable: false, align: 'center'},
              {text: '图片', value: 'imageUrl', sortable: false, align: 'center'},
              {text: '操作', sortable: false, align: 'center'}
            ],
            selected: [], // 复选选中集合
          }
        },
        created() {
          this.loadCarouselTrashCanData();
        },
        watch: {
          pagination: {
            deep: true,
            handler() {
              // 变化后的回调函数
              this.loadCarouselTrashCanData();
            }
          },
          search: {
            handler() {
              this.pagination.page = 1;
              this.loadCarouselTrashCanData();
            }
          }
        },
        methods: {
          loadCarouselTrashCanData() {
            this.$http.get("/item/carousel/find/condition", {
              params: {
                key: this.search, // 搜索条件
                page: this.pagination.page, // 当前页
                rows: this.pagination.rowsPerPage,  // 每页大小
                isDelete: true, // 是否是垃圾箱中的
              }
            }).then(resp => {
              this.carouselNews = resp.data.items;
              this.totalCarouselNews = resp.data.total;
              this.loading = false;
            }).catch(err => {
              console.log("【CarouselNews】数据加载失败，异常信息为：", err);
            });
          },
          batchDeletionCarousel() {
            if (this.selected.length == 0) {
              this.$message.error("请选择批量删除的选项");
            } else {
              this.$message.confirm("确定永久删除选中选项？").then(() => {
                let ids = [];
                for (let i=0; i<this.selected.length; i++) {
                  ids.push(this.selected[i].id);
                }
                this.$http.delete("/item/carousel/delete/permanent/list/" + ids).then(() => {
                  this.$message.success("永久删除选中选项成功");
                  this.loadCarouselTrashCanData();
                }).catch((err) => {
                  console.log("永久删除选中选项失败, 异常信息为：", err);
                  this.$message.error("永久删除选中选项失败");
                });
              });
            }
          },
          batchReductionCarousel() {
            if (this.selected.length == 0) {
              this.$message.error("请选择批量还原的选项");
            } else {
              this.$message.confirm("确定还原选中选项").then(() => {
                let ids = [];
                for (let i=0; i<this.selected.length; i++) {
                  ids.push(this.selected[i].id);
                }
                this.$http.put("/item/carousel/reduction/list/" + ids).then(() => {
                  this.$message.success("还原选中选项成功");
                  this.loadCarouselTrashCanData();
                }).catch((err) => {
                  console.log("还原选中选项失败, 异常信息为：", err);
                  this.$message.error("还原选中选项失败");
                });
              });
            }
          },
          deleteCarousel(id) {
            this.$message.confirm("确定永久删除该选项？").then(() => {
              this.$http.delete("/item/carousel/delete/permanent/" + id).then(() => {
                this.$message.success("永久删除该选项成功");
                this.loadCarouselTrashCanData();
              }).catch((err) => {
                console.log("永久删除选中选项失败, 异常信息为：", err);
                this.$message.error("永久删除该选项失败");
              });
            });
          },
          reductionCarousel(id) {
            this.$message.confirm("确定还原该选项").then(() => {
              this.$http.put("/item/carousel/reduction/" + id).then(() => {
                this.$message.success("还原该选项成功");
                this.loadCarouselTrashCanData();
              }).catch((err) => {
                console.log("还原选中选项失败, 异常信息为：", err);
                this.$message.error("还原该选项失败");
              });
            });
          },
        }
    }
</script>

<style scoped>

</style>
