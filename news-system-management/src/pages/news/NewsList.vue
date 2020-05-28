<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="addNews">新增新闻</v-btn>
      <!--搜索框，与search属性关联-->
      <v-spacer/>
      <v-flex xs2>
        时间：
        <v-btn-toggle mandatory v-model.lazy="filter.isToday">
          <v-btn flat :value="false">全部</v-btn>
          <v-btn flat :value="true">今日新闻</v-btn>
        </v-btn-toggle>
      </v-flex>
      <v-flex xs3>
        状态：
        <v-btn-toggle mandatory v-model.lazy="filter.isSend">
          <v-btn flat>全部</v-btn>
          <v-btn flat :value="true">已发布</v-btn>
          <v-btn flat :value="false">未发布</v-btn>
        </v-btn-toggle>
      </v-flex>
      <v-flex xs3>
        <v-text-field label="输入关键字搜索" v-model.lazy="filter.search" append-icon="search" hide-details/>
      </v-flex>
    </v-card-title>
    <v-divider/>

    <v-data-table
      :headers="headers"
      :items="news"
      :pagination.sync="pagination"
      :total-items="totalNews"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.title }}</td>
        <td class="text-xs-center">{{ props.item.categoryName }}</td>
        <td class="text-xs-center">
          {{props.item.status ? '已发布' : '未发布'}}
        </td>
        <td class="text-xs-center">{{ props.item.createTimeStr }}</td>
        <td class="text-xs-center">{{ props.item.updateTimeStr }}</td>

        <td class="justify-center layout px-0">
          <v-btn icon :title="props.item.status ? '取消发布' : '发布'" @click="sendNews(props.item.id)">
            <v-icon :color="props.item.status ? 'success' : 'warning'">send</v-icon>
          </v-btn>
          <v-btn icon @click="editNews(props.item)" title="编辑修改">
            <v-icon color="primary">edit</v-icon>
          </v-btn>
          <v-btn icon @click="deleteNews(props.item.id)" title="删除">
            <v-icon color="error">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <!--弹出的对话框-->
    <v-dialog max-width="700" v-model="show" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit ? '编辑' : '新增'}}新闻</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow"><v-icon>close</v-icon></v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-3" style="height:450px">
          <news-list-form @close="closeWindow" :oldNews="oldNews" :step="step" :isEdit="isEdit" ref="newsListForm" />
        </v-card-text>
        <!--   底部按钮，用来操作步骤线     -->
        <v-card-actions class="elevation-10">
          <v-flex class="xs4 mx-auto">
            <v-btn @click="previous" color="primary" :disabled="step === 1">上一步</v-btn>
            <v-btn @click="next" color="primary" :disabled="step === 3">下一步</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  // 导入自定义的表单组件
  import NewsListForm from './NewsListForm'

  export default {
    name: "NewsList",
    data() {
      return {
        filter: {
          isSend: false, // 是否已发布
          search: '', // 搜索过滤字段
          isToday: false,  // 是否是今日新闻
        },
        totalNews: 0, // 总条数
        news: [], // 当前页品牌数据
        loading: true, // 是否在加载中
        pagination: {}, // 分页信息
        headers: [
          {text: 'id', align: 'center', value: 'id', sortable: false},
          {text: '新闻标题', align: 'center', value: 'title', sortable: false},
          {text: '新闻分类', align: 'center', value: 'categoryName', sortable: false},
          {text: '新闻发布状态', align: 'center', value: 'status', sortable: false},
          {text: '新闻创建时间', align: 'center', value: 'createTime', sortable: true},
          {text: '新闻更新时间', align: 'center', value: 'updateTime', sortable: true},
          {text: '操作', align: 'center', sortable: false}
        ],
        show: false,// 控制对话框的显示
        oldNews: {}, // 即将被编辑的品牌数据
        isEdit: false, // 是否是编辑
        step: 1,  // 子组件中的步骤线索引，默认为1
      }
    },
    created() { // 渲染后执行
      // 查询数据
      this.getDataFromServer();
    },
    watch: {
      pagination: { // 监视pagination属性的变化
        deep: true, // deep为true，会监视pagination的属性及属性中的对象属性变化
        handler() {
          // 变化后的回调函数，这里我们再次调用getDataFromServer即可
          this.getDataFromServer();
        }
      },
      filter: { // 监视搜索字段
        handler() {
          this.pagination.page = 1;
          this.getDataFromServer();
        },
        deep: true
      }
    },
    methods: {
      getDataFromServer() { // 从服务的加载数的方法。
        // 发起请求
        this.$http.get("/item/newsItem/find/list", {
          params: {
            key: this.filter.search, // 搜索条件
            isSend: this.filter.isSend === 0 ? null : this.filter.isSend, //是否已发布
            isToday: this.filter.isToday, // 是否是当日新闻
            page: this.pagination.page, // 当前页
            rows: this.pagination.rowsPerPage, // 每页大小
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending, // 是否降序
          }
        }).then(resp => { // 这里使用箭头函数
          this.news = resp.data.items;
          this.totalNews = resp.data.total;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        });
      },
      addNews() {
        // 修改标记
        this.isEdit = false;
        // 控制弹窗可见：
        this.show = true;
        // 把oldNews变为null
        this.oldNews = {};
      },
      async editNews(oldNews){
          oldNews.details = await this.$http.loadData("/item/newsDetail/find/" + oldNews.id);
          // 修改标记
          this.isEdit = true;
          // 控制弹窗可见：
          this.show = true;
          // 获取要编辑的brand
          this.oldNews = oldNews;
      },
      deleteNews(id) {
        this.$message.confirm("确定要把该新闻删除到垃圾箱？").then(() => {
            this.$http.delete("/item/newsItem/delete/temporarily/" + id).then(() => {
              this.$message.success("删除成功");
              this.getDataFromServer();
            }).catch(() => {
              this.$message.error("删除失败");
            });
        });
      },
      sendNews(id) {
        this.$http.put("/item/newsItem/status/" + id).then(() => {
          this.$message.success("新闻发布成功");
          this.getDataFromServer();
        }).catch(() => {
          this.$message.error("新闻发布失败");
        });
      },
      closeWindow(){
        // 重新加载数据
        this.getDataFromServer();
        // 关闭窗口
        this.show = false;
        // 将步骤调整到1
        this.step = 1;
      },
      previous() {
        if (this.step > 1) {
          this.step --;
        }
      },
      next() {
        if (this.step < 3 && this.$refs.newsListForm.$refs.basic.validate()) {
          this.step ++;
        }
      }
    },
    components:{
      NewsListForm
    }
  }
</script>
