const newsTop = {
    template: "<el-row>\n" +
        "            <el-col :span=\"4\" class=\"bg-black grid-top-content\"></el-col>\n" +
        "            <el-col :span=\"16\">\n" +
        "                <div class=\"bg-black grid-top-content\">\n" +
        "                    <el-col :span=\"12\">\n" +
        "                        <div><h2><a class=\"color-grep-1\" href=\"#\">Sunxn News</a></h2></div>\n" +
        "                    </el-col>\n" +
        "                    <el-col :span=\"12\">\n" +
        "                        <div>\n" +
        "                            <el-input prefix-icon=\"el-icon-search\" placeholder=\"搜索词\" v-model=\"search\" clearable>\n" +
        "                                <el-button @click=\"newsItemSearch\" slot=\"append\">搜索</el-button>\n" +
        "                            </el-input>\n" +
        "                        </div>\n" +
        "                    </el-col>\n" +
        "                </div>\n" +
        "                <el-dialog :title=\" '【 ' + search + ' 】 的相关搜索结果为： ' + totalSearch\" :visible.sync=\"searchVisible\">\n" +
        "                    <ul class=\"news-dialog-ul\">\n" +
        "                        <li v-for=\"(searchNew, i) in searchNews\" title=\"searchNew.title\"><a :href=\"'./newsDetail.html?newsId=' + searchNew.id\" target=\"_blank\"><i class=\"text-bold color-blue-light\">{{i}}、</i> {{searchNew.title}}</a></li>\n" +
        "                    </ul>\n" +
        "                </el-dialog>\n" +
        "            </el-col>\n" +
        "            <el-col :span=\"4\" class=\"bg-black grid-top-content\"></el-col>\n" +
        "        </el-row>",
    data() {
        return {
            searchVisible: false, // 对话框是否可见
            search: '', // 搜索关键词
            searchNews: [], // 搜索新闻集合
            totalSearch: 0, // 相关搜索结果条数
        }
    },
    methods: {
        newsItemSearch() {
            if (this.search) {
                this.searchVisible = true;
                this.searchNews = [];
                // 往后台服务发送搜索请求
                axios.get(BASE_URL + "/search/search/search/key", {
                    params: {
                        key: this.search
                    }
                }).then(resp => {
                    this.searchNews = resp.data;
                    this.totalSearch = this.searchNews.length;
                    console.log("搜索到的news为：", resp);
                }).catch(err => {
                    console.log("【搜索服务】关键词搜索失败，异常信息为：", err);
                });
            }
        },
    }
};

