<template>
  <v-app dark>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>sunxn news system 后台管理</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" v-model="form.username" label="用户名" type="text"/>
                  <v-text-field
                    prepend-icon="lock"
                    v-model="form.password"
                    label="密码"
                    id="password"
                    :append-icon="e1 ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (e1 = !e1)"
                    :type="e1 ? 'text' : 'password'"
                 ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="doLogin">登录</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-dialog v-model="dialog" width="300px">
      <v-alert icon="warning" color="error" :value="true">
      用户名和密码不能为空
      </v-alert>
    </v-dialog>
  </v-app>
</template>

<script>

import config from "../config";

export default {

  data: () => ({
    form: {
      username: "",
      password: "",
    },
    dialog: false,
    e1:false
  }),
  methods: {
    doLogin() {
      if (!this.form.username || !this.form.password) {
        this.dialog = true;
        return false;
      }
      let data = new FormData();
      data.append("username", this.form.username);
      data.append("password", this.form.password);
      this.$http.post("/item/user/login", data).then(resp => {
        this.$message.success("登录成功!!!");
        window.location = config.localUrl;
      }).catch(err => {
        this.$message.error("用户名或密码错误，登录失败，请重新登录");
        window.location = config.localUrl + "/#/login";
      });
    },
    getCookie(name) {
      let arr, reg = new RegExp("(^| )" + name + "-([^;]*)(;|&)");
      if (arr = document.cookie.match(reg)) {
        return (arr[2]);
      } else {
        return null;
      }
    }
  }
};
</script>
