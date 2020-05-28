<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" step="1">基本信息</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 2" step="2">详细信息</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 3" step="3">其他信息</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <!--  1. 基本信息    -->
      <v-stepper-content step="1">
        <v-flex class="xs10 mx-auto">
          <v-form v-model="valid" ref="basic">
            <v-text-field label="新闻标题" v-model="news.title" :counter="50" required :rules="[v => !!v || '新闻标题不能为空']" hide-details></v-text-field>
            <v-layout row>
              <v-flex xs5>
                <!--      新闻分类          -->
                <v-select label="新闻分类" required autocomplete
                    v-model="news.categoryId" :items="categories"
                    item-value="id" item-text="name" :rules="[v => !!v || '请选择新闻分类']"></v-select>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs5>
                <v-select label="新闻发布状态" required autocomplete
                          v-model="news.status" :items="newsStatusOptions"
                          item-value="isSend" item-text="name"></v-select>
              </v-flex>
            </v-layout>
            <v-text-field label="url链接" v-model="news.url"></v-text-field>
            <v-text-field label="创建时间" disabled v-model="news.createTimeStr"></v-text-field>
            <v-text-field label="更新时间" disabled v-model="news.updateTimeStr"></v-text-field>
          </v-form>
        </v-flex>
      </v-stepper-content>
      <!--  2. 详细信息    -->
      <v-stepper-content step="2">
        <v-editor v-model="news.details.content" upload-url="/upload/image"></v-editor>
      </v-stepper-content>
      <!--  3. 其他信息   -->
      <v-stepper-content step="3">
        <v-flex class="xs10 mx-auto">
          <v-text-field label="新闻来源" :counter="50" v-model="news.details.come"></v-text-field>
          <v-text-field label="新闻关键词" :counter="50" v-model="news.details.keyword"></v-text-field>
          <v-text-field label="备注" :counter="50" v-model="news.details.notes"></v-text-field>
        </v-flex>
        <!--   提交按钮     -->
        <v-flex xs3 offset-xs9>
          <v-btn color="info" @click="submit">保存新闻信息</v-btn>
        </v-flex>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  export default {
    name: "NewsListForm",
    props: {
      oldNews: {
        type: Object
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      step: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        valid: false, // 表单校验结果标记
        news: {
          id: 0,
          title: '', // 新闻标题
          categoryId: 0,  // 新闻分类id
          categoryName: '', // 新闻分类名称
          status: false, // 发布状态
          url: '',  // 该新闻url地址
          createTime: '', // 创建时间
          updateTime: '', // 更新时间
          createTimeStr: new Date().toLocaleDateString,  // 创建时间字符串
          updateTimeStr: new Date().toLocaleDateString,  // 更新时间字符串
          details: {
            come: '', // 新闻来源
            content: '', // 新闻内容
            keyword: '', // 新闻关键词
            notes: '', // 备注
          }
        },
        categories: [], // 新闻分类信息
        newsStatusOptions: [
          {isSend: false, name: '未发布'},
          {isSend: true, name: '已发布'}
        ],
      }
    },
    mounted() {
      this.getCategoriesData();
    },
    methods: {
      submit() {
        // 表单校验
        if (!this.$refs.basic.validate) {
          this.$message.error("请先完成表单内容！");
        }
        this.$http({
          method: this.isEdit ? "put" : "post",
          url: "/item/newsItem/news",
          data: this.news
        }).then(() => {
          // 成功，关闭窗口
          this.$emit("close");
          // 提示成功
          this.$message.success("保存成功了！");
        }).catch((err) => {
          console.log("新闻信息保存失败，异常：", err);
          this.$message.error("保存失败！");
        });
      },
      getCategoriesData() {
        this.$http.get("/item/category/find/list").then((resp) => {
          this.categories = resp.data;
        }).catch((err) => {
          console.log("categories获取异常，", err);
        });
      },
    },
    watch: {
      oldNews: {
        deep: true,
        handler(val) {
          if (!this.isEdit) {
            Object.assign(this.news, {
              id: 0,
              title: '', // 新闻标题
              categoryId: 0,  // 新闻分类id
              categoryName: '', // 新闻分类名称
              status: false, // 发布状态
              url: '',  // 该新闻url地址
              createTime: '', // 创建时间
              updateTime: '', // 更新时间
              createTimeStr: new Date().toLocaleDateString(),  // 创建时间字符串
              updateTimeStr: new Date().toLocaleDateString(),  // 更新时间字符串
              details: {
                come: '', // 新闻来源
                content: '', // 新闻内容
                keyword: '', // 新闻关键词
                notes: '', // 备注
              }
            });
          } else {
            this.news = Object.deepCopy(val);
          }
        }
      },
    }
  }
</script>
