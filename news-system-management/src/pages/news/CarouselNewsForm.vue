<template>
  <v-form v-model="valid" ref="myCarouselNewsForm">
    <v-layout row>
      <v-select label="分类" :items="categories"
        item-text="name" item-value="id" v-model="carouselNew.categoryId"
        autocomplete required :rules="[v => !!v || '请选择新闻分类']"></v-select>
    </v-layout>
    <v-layout row>
      <v-select label="新闻" :items="newsItems"
        item-text="title" item-value="id" v-model="carouselNew.newsId"
        autocomplete required :rules="[v => !!v || '请选择新闻，如果没有选择，请先新建该新闻分类，在继续选择']"></v-select>
    </v-layout>
    <v-layout row>
      <v-card class="elevation-2 flex xs11 mx-auto my-2">
        <v-card-title>图片上传：</v-card-title>
        <v-upload :multiple="false" v-model="carouselNew.imageUrl" url="/upload/image"></v-upload>
      </v-card>
    </v-layout>
    <v-text-field label="备注" v-model="carouselNew.notes"></v-text-field>
    <v-text-field label="优先级" v-model="carouselNew.sorted" :rules="sortedRules"></v-text-field>
    <v-layout class="my-2" row>
      <v-spacer></v-spacer>
      <v-btn @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
    export default {
        name: "CarouselNewsForm",
        props: {
          oldCarouselNews: {
            type: Object
          },
          isEdit: {
            type: Boolean,
            default: false
          }
        },
        data() {
          return {
            valid: false, // 表单校验结果标记
            carouselNew: {
              id: 0,  // id
              categoryId: 0,  // 分类id
              categoryName: '', // 分类名称
              newsId: 0,  // 新闻id
              title: '',  // 标题
              imageUrl: '', // 图片url地址
              notes: '',  // 备注
              sorted: 1,  // 优先级
            },
            categories: [], // 分类集合
            newsItems: [],  // 新闻集合
            sortedRules: [
              v => {
                let numRegStr = /^[0-9]*$/;
                let numReg = new RegExp(numRegStr);
                if (!numReg.test(v)) {
                  return '【新闻轮播图】优先级必须为数字';
                }
              },
            ],
          }
        },
        created() {
          this.loadCategoriesInfo();
        },
        methods: {
          submit() {
            // 表单校验
            if (!this.$refs.myCarouselNewsForm.validate) {
              this.$message.error("请先按照表单要求完成！");
            }
            this.$http({
              method: this.isEdit ? "put" : "post",
              url: "/item/carousel/save",
              data: this.carouselNew
            }).then(() => {
              this.$emit("close");
              this.$message.success("保存成功了");
            }).catch((err) => {
              console.log("【轮播图新闻】保存失败了，异常原因为：", err);
              this.$message.error("保存失败了");
            });
          },
          clear() {
            this.$refs.myCarouselNewsForm.reset();
          },
          loadCategoriesInfo() {
            this.$http.get("/item/category/find/list").then(resp => {
              this.categories = resp.data;
            }).catch(err => {
              console.log("【轮播图新闻】分类数据加载失败！");
            });
          }
        },
        watch: {
          oldCarouselNews: {
            deep: true,
            handler(value) {
              if (!this.isEdit) {
                Object.assign(this.carouselNew, {
                  id: 0,  // id
                  categoryId: 0,  // 分类id
                  categoryName: '', // 分类名称
                  newsId: 0,  // 新闻id
                  title: '',  // 标题
                  imageUrl: '', // 图片url地址
                  notes: '',  // 备注
                  sorted: 1,  // 优先级
                });
              } else {
                this.carouselNew = Object.deepCopy(value);
              }
            }
          },
          "carouselNew.categoryId": {
            handler(val) {
              this.newsItems = [];
              this.$http.get("/item/newsItem/find/" + val).then(resp => {
                this.newsItems = resp.data;
              }).catch(err => {
                console.log("【轮播图新闻】新闻数据加载失败！");
              });
            }
          },
        },
    }
</script>

<style scoped>

</style>
