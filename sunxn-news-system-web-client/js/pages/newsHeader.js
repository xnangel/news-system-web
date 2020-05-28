const newsHeader = {
    template: "<el-row>\n" +
        "            <el-col :span=\"4\" class=\"bg-red grid-header-content\"></el-col>\n" +
        "            <el-col :span=\"16\">\n" +
        "                <div>\n" +
        "                    <el-menu :default-active=\"activeIndex\" class=\"el-menu-demo\"\n" +
        "                             mode=\"horizontal\" @select=\"handleSelect\"\n" +
        "                             background-color=\"#C20C0C\" text-color=\"#fff\" active-text-color=\"#E6A23C\"\n" +
        "                    >\n" +
        "                        <el-menu-item v-for=\"(category, key) in categories\" :key='key' :index=\"key + ''\"><h3><a :href=\"(key === 0 ? './index.html' : './mainCategory.html') + '?id=' + category.id + '&activeIndex=' + key\">{{category.name}}</a></h3></el-menu-item>\n" +
        "                        <el-menu-item :index=\"totalCategories + ''\"><h3><a :href=\"'./othersCategory.html?activeIndex=' + totalCategories\">其它</a></h3></el-menu-item>\n" +
        "                    </el-menu>\n" +
        "                </div>\n" +
        "            </el-col>\n" +
        "            <el-col :span=\"4\" class=\"bg-red grid-header-content\"></el-col>\n" +
        "        </el-row>\n",
    data() {
        return {
            activeIndex: '0',   // 当前分类index
            categories: [], // 分类数据集合
            totalCategories: 0,
        }
    },
    created() {
        this.loadingCategoryData();
        this.parseActiveIndex();
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        parseActiveIndex() {
            let parameter = getParameter("activeIndex");
            if (parameter) {
                this.activeIndex = parameter;
            }
        },
        loadingCategoryData() {
            // 查询目录数据
            axios.get(BASE_URL + "/item/category/find/0").then(resp => {
                this.categories = resp.data;
                this.totalCategories = this.categories.length;
                console.log("totalCategories: " , this.totalCategories);
            }).catch(err => {
                console.log("【分类】数据加载失败，异常为：", err);
            });
        }
    }
};

