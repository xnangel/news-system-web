<template>
    <v-form v-model="valid" ref="myCategoryForm">
      <v-text-field v-model="category.name" label="请输入品牌名称" required :rules="nameRules"></v-text-field>
      <v-layout row>
        <v-select label="分类类型" :items="typeOptions"
            item-text="name" item-value="value"
                  v-model="category.type" autocomplete required></v-select>
      </v-layout>
      <v-layout row>
        <v-select label="该分类是否启用" :items="statusOptions"
            item-value="value" item-text="name"
            v-model="category.status" autocomplete required></v-select>
      </v-layout>
      <v-text-field v-model="category.notes" label="分类备注"></v-text-field>
      <v-layout class="my-2" row>
        <v-spacer></v-spacer>
        <v-btn @click="submit" color="primary">提交</v-btn>
        <v-btn @click="clear">重置</v-btn>
      </v-layout>
    </v-form>
</template>

<script>
  export default {
    name: "CategoryForm",
    props: {
      oldCategory: {
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
        category: {
          id: 0,  // 分类id默认为0
          name: '', // 分类名称
          type: 0,  // 分类类型，默认主要
          status: false, // 分类状态，默认禁用
          notes: '',  // 分类备注
        },
        nameRules: [
          v => !!v || "分类名称不能为空",
          v => v.length > 1 || "分类名称至少2位",
        ],
        typeOptions: [
          {name: '主栏', value: 0},
          {name: '其它', value: 1},
          {name: '排行榜', value: 2}
        ],
        statusOptions: [
          {name: '启用', value: true},
          {name: '禁用', value: false}
        ],
      }
    },
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.myCategoryForm.validate()) {
          // 将数据提交到后台
          this.$http({
            method: this.isEdit ? "put" : "post",
            url: "/item/category/save/category",
            data: this.category
          }).then(() => {
            // 关闭窗口
            this.$emit("close");
            this.$message.success("保存成功！");
          }).catch(() => {
            this.$message.error("保存失败！");
          });
        }
      },
      clear() {
        // 重置表单
        this.$refs.myCategoryForm.reset();
      }
    },
    watch: {
      // 监控oldCategory的变化
      oldCategory: {
        deep: true,
        handler(val) {
          if (val) {
            // 注意：不要直接复制，否则这边的修改会影响到父组件的数据，copy属性即可
            this.category = Object.deepCopy(val);
          } else {
            // 为空，初始化category
            this.category = {
              id: 0,  // 分类id默认为0
              name: '', // 分类名称
              type: 0,  // 分类类型，默认主要
              status: false, // 分类状态，默认禁用
              notes: '',  // 分类备注
            }
          }
        }
      }
    }
  };
</script>

