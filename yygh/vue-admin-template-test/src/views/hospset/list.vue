<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
         <el-form-item>
              <el-input v-model="searchObj.hosname" placeholder="医院名称" />
           </el-form-item
      >
         <el-form-item>
              <el-input v-model="searchObj.hoscode" placeholder="医院编号" />
           </el-form-item
      >
         <el-button type="primary" icon="el-icon-search" @click="getList()">
        查询
      </el-button>
      <el-button type="danger" icon="el-icon-search" @click="removeRows()"
        >批量删除</el-button
      >
    </el-form>
    <el-table
      :data="list"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column prop="hosname" label="医院名称" />
      <el-table-column prop="hoscode" label="医院编号" />
      <el-table-column prop="apiUrl" label="api基础路径" width="200" />
      <el-table-column prop="contactsName" label="联系人姓名" />
      <el-table-column prop="contactsPhone" label="联系人手机" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? "可用" : "不可用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.status == 1"
            type="primary"
            size="mini"
            icon="el-icon-delete"
            @click="lockHospSet(scope.row.id, 0)"
            >锁定</el-button
          >
          <el-button
            v-if="scope.row.status == 0"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="lockHospSet(scope.row.id, 1)"
            >解除锁定</el-button
          >
          <router-link :to="'/hospSet/edit/' + scope.row.id">
               <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            >编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="current"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0;  text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>
<script>
// 引入接口定义的js文件
import hospset from "@/api/hospset";

export default {
  data() {
    return {
      current: 1,
      limit: 3,
      searchObj: {}, //条件封装对象
      list: [], //每页数据集合
      total: 0,
      multipleSelection: [], // 批量选择中选择的记录列表
    };
  },
  created() {
    //在页面渲染之前执行
    //调用methods定义的方法
    this.getList();
  },
  methods: {
    //定义方法进行请求接口的调用
    // 医院设置列表方法
    getList(page = 1) {
      //添加当前页的参数
      this.current = page;
      hospset
        .getHospSetList(this.current, this.limit, this.searchObj)
        .then((response) => {
          this.list = response.data.records;
          this.total = response.data.total;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 删除医院设置方法
    removeDataById(id) {
      this.$confirm("此操作将永久删除医院设置信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 确定执行then
          // 调用接口
          hospset.deleteHospSet(id).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 刷新页面
            this.getList(1);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 批量删除
    removeRows() {
      if (this.multipleSelection.length === 0) {
        this.$message.error("请先选择要删除的文件");
      } else {
        this.$confirm("此操作将永久删除医院设置信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            var idList = [];
            for (var i = 0; i < this.multipleSelection.length; i++) {
              var obj = this.multipleSelection[i];
              var id = obj.id;
              idList.push(id);
            }
            // 确定执行then
            // 调用接口
            hospset.banchRemoveHospSet(idList).then((response) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              // 刷新页面
              this.getList(1);
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    // 获取选择复选框的id
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    // 锁定和取消锁定
    lockHospSet(id, status) {
      this.$confirm("此操作将更改医院状态信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用接口
          hospset.lockHospSet(id, status).then((responce) => {
            this.$message({
              type: "success",
              message: "状态更改成功!",
            });
            // 刷新页面
            this.getList(1);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
  },
};
</script>