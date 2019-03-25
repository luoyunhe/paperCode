<template lang="html">
  <div >
      <el-container>
          <el-header class="header">{{selected}}</el-header>
          <el-main>
              <router-view></router-view>
          </el-main>
          <el-footer class="footer">
              <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                   <el-menu-item index="1">
                       <i class="el-icon-edit"></i>
                       录入
                   </el-menu-item>
                   <el-menu-item index="2">
                      <i class="el-icon-search"></i>
                      查询
                   </el-menu-item>
                   <el-menu-item index="3">
                       <i class="el-icon-setting"></i>
                       设置
                   </el-menu-item>
              </el-menu>

               
          </el-footer>
     </el-container>
  </div>
</template>

<script>
export default {
    data() {
        return {
            selected: "record",
            activeIndex:'1'
        };
    },
    watch: {
        selected(curVal, oldVal) {
            this.$router.push(curVal);
        }
    },
    methods: {
        handleSelect(key, keyPath){
            console.log(key, keyPath);
            if(key=='1'){
                this.selected='pcrecord';
            }
            if(key=='2'){
                this.selected='pcquery';
            }
            if(key=='3'){
                this.selected='pcsetting';
            }
        }
    }
};
</script>

<style scoped>
     .header  {
  background-color: pink;
  font-size: 26px;
  line-height: 60px;
  color: #555;
}
.footer{
    background-color: pink;
    position:fixed;
    bottom:0;
    width:100%;
    
}
.el-menu-demo{
    
    background-color: pink;
}
.el-menu-item{
   /*margin-left:120px;
   margin-right:120px;*/
   width:33.3%;
}
</style>