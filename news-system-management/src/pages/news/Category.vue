<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="addCategory">新增分类</v-btn>
      <v-spacer></v-spacer>
      <v-flex xs3>
        <v-text-field label="分类搜索" v-model.lazy="search" append-icon="search" hide-details></v-text-field>
      </v-flex>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table :headers="headers" :items="categories"
        :pagination.sync="pagination" :total-items="totalCategories"
        :loading="loading" class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{props.item.id}}</td>
        <td class="text-xs-center">{{props.item.name}}</td>
        <td class="text-xs-center">
          {{props.item.type === 0 ? '主栏': props.item.type === 1 ? '其它' : '排行榜'}}
        </td>
        <td class="text-xs-center">
          {{props.item.status ? '启用' : '禁用'}}
        </td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="editCategory(props.item)">
            <i class="el-icon-edit"></i>
          </v-btn>
          <v-btn icon :title="props.item.status ? '禁用' : '启用'" @click="deleteCategory(props.item.id)">
            <v-icon :color="props.item.status ? 'warning' : 'success'">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <!--  弹出的对话框  -->
    <v-dialog max-width="500" v-model="show" persistent scrollable>
      <v-card>
        <!--   对话框的标题     -->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit ? '修改' : '新增'}}分类</v-toolbar-title>
          <v-spacer></v-spacer>
          <!--    关闭窗口的按钮      -->
          <v-btn icon @click="closeWindow"><v-icon>close</v-icon></v-btn>
        </v-toolbar>

        <!--   对话框的内容，表单     -->
        <v-card-text class="px-5" style="height: 400px;">
          <category-form @close="closeWindow" :oldCategory="oldCategory" :isEdit="isEdit"></category-form>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>
  // 导入自定义的表单组件
  import CategoryForm from "./CategoryForm";

  export default {
    name: "Category",
    data() {
      return {
        search: '', // 搜索过滤字段
        totalCategories: 0, // 总条数
        categories: [], // 当前页分类数据
        loading: true, // 是否在加载中
        pagination: {}, // 分页信息
        headers: [
          {text: 'id', align: 'center', value: 'id', sortable: false},
          {text: '名称', align: 'center', value: 'name', sortable: false},
          {text: '类型', align: 'center', value: 'type', sortable: true},
          {text: '状态', align: 'center', value: 'status', sortable: true},
          {text: '操作', align: 'center', sortable: false}
        ],
        show: false,  // 控制对话框的显示
        oldCategory: {},  // 即将被编辑的品牌数据
        isEdit: false,  // 是否是编辑
      }
    },
    mounted() {
      this.loadCategoriesDate();
    },
    watch: {
      pagination: { // 监视pagination属性的变化
        deep: true, //deep为true，会监视pagination的属性及属性中的对象属性变化
        handler() {
          this.loadCategoriesDate();
        }
      },
      search: {
        handler() {
          this.pagination.page = 1;
          this.loadCategoriesDate();
        }
      }
    },
    methods: {
      loadCategoriesDate() {
        this.$http.get("/item/category/find/page", {
          params: {
            key: this.search, // 搜索条件
            page: this.pagination.page,  // 当前页
            rows: this.pagination.rowsPerPage,  // 每页大小
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending, // 是否降序
          }
        }).then(resp => {
          this.categories = resp.data.items;
          this.totalCategories = resp.data.total;
          this.loading = false;
        }).catch(err => {
          console.log("err异常 ", err);
        });
      },
      addCategory() {
        // 修改标记
        this.isEdit = false;
        // 控制弹窗可见
        this.show = true;
        // oldCategory置空
        this.oldCategory = null;
      },
      editCategory(oldCategory) {
        this.isEdit = true;
        this.show = true;
        this.oldCategory = oldCategory;
      },
      deleteCategory(id) {
        this.$http.put("/item/category/update/status/" + id).then(() => {
          this.$message.success(this.status ? "禁用---成功" : "启用---成功");
          this.loadCategoriesDate();
        }).catch(() => {
          this.$message.error(this.status ? "禁用---失败" : "启用---失败");
        });
      },
      closeWindow() {
        // 重新加载数据
        this.loadCategoriesDate();
        // 关闭窗口
        this.show = false;
      },
    },
    components: {
      CategoryForm
    }
  };
</script>

