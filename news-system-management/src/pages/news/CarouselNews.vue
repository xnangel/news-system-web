<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="addCarouselNews">新增轮播图</v-btn>
      <v-spacer></v-spacer>
      <v-flex xs3>
        <v-text-field label="标题搜索" v-model.lazy="search" append-icon="search" hide-details></v-text-field>
      </v-flex>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table :headers="headers" :items="carouselNews"
      :pagination.sync="pagination" :total-items="totalCarouselNews"
      :loading="loading" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{props.item.id}}</td>
        <td class="text-xs-center">{{props.item.categoryName}}</td>
        <td class="text-xs-center">{{props.item.title}}</td>
        <td class="text-xs-center">
          <img :src="props.item.imageUrl" height="100px">
        </td>
        <td class="text-xs-center">
          <v-btn icon @click="editCarouselNews(props.item)">
            <i class="el-icon-edit"></i>
          </v-btn>
          <v-btn icon @click="deleteCarouselNews(props.item.id)">
            <i class="el-icon-delete"></i>
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <!--  弹出的对话框  -->
    <v-dialog max-width="500" v-model="show" persistent scrollable>
      <v-card>
        <!--   对话框的标题     -->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit? '修改':'新增'}}轮播图新闻</v-toolbar-title>
          <v-spacer></v-spacer>
          <!--    关闭窗口的按钮      -->
          <v-btn icon @click="closeWindow"><v-icon>close</v-icon></v-btn>
        </v-toolbar>

        <!--   对话框的内容，表单     -->
        <v-card-text class="px-5" style="height: 400px;">
          <carousel-news-form @close="closeWindow" :oldCarouselNews="oldCarouselNews" :isEdit="isEdit"></carousel-news-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import CarouselNewsForm from "./CarouselNewsForm";

    export default {
        name: "CarouselNews",
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
            show: false,  // 控制对话框的显示
            oldCarouselNews: {}, // 旧的轮播图新闻
            isEdit: false,  // 是否是编辑
          }
        },
        created() {
          this.loadCarouselNewsData();
        },
        watch: {
          pagination: {
            deep: true,
            handler() {
              // 变化后的回调函数
              this.loadCarouselNewsData();
            }
          },
          search: {
            handler() {
              this.pagination.page = 1;
              this.loadCarouselNewsData();
            }
          }
        },
        methods: {
          addCarouselNews() {
            this.isEdit = false;
            this.show = true;
            this.oldCarouselNews = {};
          },
          loadCarouselNewsData() {
            this.$http.get("/item/carousel/find/condition", {
              params: {
                key: this.search, // 搜索条件
                page: this.pagination.page, // 当前页
                rows: this.pagination.rowsPerPage,  // 每页大小
              }
            }).then(resp => {
              this.carouselNews = resp.data.items;
              this.totalCarouselNews = resp.data.total;
              this.loading = false;
            }).catch(err => {
              console.log("【CarouselNews】数据加载失败，异常信息为：", err);
            });
          },
          editCarouselNews(carouselNews) {
            this.isEdit = true;
            this.show = true;
            this.oldCarouselNews = carouselNews;
          },
          deleteCarouselNews(id) {
            this.$message.confirm("确定把该轮播图新闻删除？").then(() => {
                this.$http.delete("/item/carousel/delete/temporarily/" + id).then(() => {
                  this.$message.success("删除成功，如需还原，请去垃圾桶");
                  this.loadCarouselNewsData();
                }).catch(() => {
                  this.$message.error("删除失败");
                });
            });
          },
          closeWindow() {
            // 重新加载数据
            this.loadCarouselNewsData();
            // 关闭窗口
            this.show = false;
          }
        },
        components: {
            CarouselNewsForm,
        }
    }
</script>

