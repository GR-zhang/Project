<template>
  <div class="dynamic-route">
    <div class="table_card">
      <!-- 表格 -->
      <div class="mb_10" style="text-align: right;">
        <el-button type="success" size="mini" @click="openAddOrEditDialog('addRoot')">添加根路由</el-button>
      </div>
      <el-table
        :data="tableData" border v-loading="loading_table"
        row-key="menuId" :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
      >
        <el-table-column label="路由标题" min-width="150px">
          <template slot-scope="{ row }">
            {{ row.menuName }} <svg-icon v-if="row.icon" :icon-class="row.icon" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="路由图标" prop="icon" min-width="100px" /> -->
        <!-- <el-table-column label="路由路径" prop="path" min-width="100px" /> -->
        <el-table-column label="路由名称" prop="menuRoute" min-width="100px" />
        <el-table-column label="组件路径" prop="component" min-width="150px" />
        <el-table-column label="重定向地址" prop="superRedirect" min-width="150px" />
        <el-table-column label="操作" width="220px">
          <template slot-scope="{ row }">
            <el-button
              v-if="row.menuType != 3"
              type="text" class="text_green" @click="openAddOrEditDialog('addSon', row)">添加子路由</el-button>
            <el-button 
              v-if="row.menuType == 2"
              type="text" class="text_green" @click="openAddOrEditDialog('addBtn', row)">添加按钮</el-button>
            <el-button type="text" @click="openAddOrEditDialog('edit', row)">编辑</el-button>
            <el-button type="text" class="text_red" @click="handleDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 对话框 -->
      <route-add-or-edit-dialog 
        :dialog-visible.sync="dialogVisible"
        :dialog-type="dialogType"
        :row-data="rowData"
        
        @refresh="_getAllMenu" />
    </div>
  </div>
</template>

<script>
import RouteAddOrEditDialog from './components/RouteAddOrEditDialog'

export default {
  name: 'DynamicRoute',
  components: { RouteAddOrEditDialog },

  data() {
    return {
      // 表格
      tableData: [
        {
          path: '/marketing',
          component: 'Layout',
          title: '营销推广',
          icon: 'huodong',
          superRedirect: 'marketing',
          name: 'Marketing',
          children: [
            {
              path: 'leaderboard-views',
              component: '/marketing/sec-view',
              name: 'LeaderboardViews',
              title: '排行榜',
              superRedirect: '/marketing/leaderboard-views',
              children: [
                {
                  path: 'rmxl-cpxs',
                  component: '/marketing/leaderboard-views/rmxl-cpxs',
                  name: 'RmxlCpxs',
                  title: '热门系列藏品销售',
                  superRedirect: '/marketing/leaderboard-views/rmxl-cpxs'
                },
                {
                  path: 'yhtj-ysm',
                  component: '/marketing/leaderboard-views/yhtj-ysm',
                  name: 'YhtjYsm',
                  title: '用户推荐已实名',
                  superRedirect: '/marketing/leaderboard-views/yhtj-ysm',
                },
                {
                  path: 'xt-cpxs',
                  component: '/marketing/leaderboard-views/xt-cpxs',
                  name: 'XtCpxs',
                  title: '系统藏品销售',
                  superRedirect: '/marketing/leaderboard-views/xt-cpxs'
                }
              ]
            },
            {
              path: 'whitelist',
              component: '/marketing/whitelist',
              name: 'Whitelist',
              title: '白名单管理',
              superRedirect: '/marketing/whitelist'
            },
            {
              path: 'presale-calendar',
              component: '/marketing/presale-calendar',
              name: 'PresaleCalendar',
              title: '预售日历',
              superRedirect: '/marketing/presale-calendar'
            },
            {
              path: 'airdrop-views',
              component: '/marketing/sec-view',
              name: 'AirdropViews',
              title: '空投管理',
              superRedirect: '/marketing/airdrop-views',
              children: [
                {
                  path: 'airdrop-activity',
                  component: '/marketing/airdrop-views/airdrop-activity',
                  name: 'AirdropActivity',
                  title: '空投活动',
                  superRedirect: '/marketing/airdrop-views/airdrop-activity'
                },
                {
                  path: 'airdrop-record',
                  component: '/marketing/airdrop-views/airdrop-record',
                  name: 'AirdropRecord',
                  title: '空投记录',
                  superRedirect: '/marketing/airdrop-views/airdrop-record'
                },
              ]
            },
            {
              path: 'blindbox-views',
              component: '/marketing/sec-view',
              name: 'BlinkboxViews',
              title: '盲盒管理',
              superRedirect: '/marketing/blindbox-views',
              children: [
                {
                  path: 'blindbox-activity',
                  component: '/marketing/blindbox-views/blindbox-activity',
                  name: 'BlindboxActivity',
                  title: '盲盒活动',
                  superRedirect: '/marketing/blindbox-views/blindbox-activity'
                },
                {
                  path: 'blindbox-record',
                  component: '/marketing/blindbox-views/blindbox-record',
                  name: 'BlindboxRecord',
                  title: '盲盒记录',
                  superRedirect: '/marketing/blindbox-views/blindbox-record'
                },
              ]
            },
            {
              path: 'buy-first',
              component: '/marketing/buy-first',
              name: 'BuyFirst',
              title: '优先购活动',
              superRedirect: '/marketing/buy-first'
            },
            {
              path: 'synthesis-views',
              component: '/marketing/sec-view',
              name: 'SynthesisViews',
              title: '合成管理',
              superRedirect: '/marketing/synthesis-views',
              children: [
                {
                  path: 'synthesis-combo',
                  component: '/marketing/synthesis-views/synthesis-combo',
                  name: 'SynthesisCombo',
                  title: '合成套餐',
                  superRedirect: '/marketing/synthesis-views/synthesis-combo'
                },
                {
                  path: 'synthesis-record',
                  component: '/marketing/synthesis-views/synthesis-record',
                  name: 'SynthesisRecord',
                  title: '合成记录',
                  superRedirect: '/marketing/synthesis-views/synthesis-record'
                }
              ]
            },
            {
              path: 'auction-views',
              component: '/marketing/sec-view',
              name: 'AuctionViews',
              title: '竞拍管理',
              superRedirect: '/marketing/auction-views',
              children: [
                {
                  path: 'auction-list',
                  component: '/marketing/auction-views/auction-list',
                  name: 'AuctionList',
                  title: '竞拍列表',
                  superRedirect: '/marketing/auction-views/auction-list'
                },
                {
                  path: 'auction-audit',
                  component: '/marketing/auction-views/auction-audit',
                  name: 'AuctionAudit',
                  title: '竞拍审核',
                  superRedirect: '/marketing/auction-views/auction-audit'
                },
                {
                  path: 'auction-set',
                  component: '/marketing/auction-views/auction-set',
                  name: 'AuctionSet',
                  title: '竞拍设置',
                  superRedirect: '/marketing/auction-views/auction-set'
                }
              ]
            }
          ]
        }
      ],
      // 对话框
      dialogVisible: false,
      dialogType: 'addRoot',
      rowData: {}
    }
  },

  created() {
    this._getAllMenu();
  },

  methods: {
    /**获取所有菜单*/
    async _getAllMenu() {
      this.loading_table = true;
      try{
        let res = await this.$api.get_allMenu(2);
        this.tableData = res.data || [];
      }catch(e) {
        throw e;
      }finally {
        this.loading_table = false;
      }
    },
    /**打开对话框*/
    async openAddOrEditDialog(type, row) {
      if(type == 'addRoot') {//添加根路由
        this.rowData = {
          parentId: undefined,
          menuType: 1,//目录
        };
      }else if(type == 'addSon') {//添加子路由
        this.rowData = {
          icon: '',

          parentId: row.menuId,
          menuType: 2,//菜单
          parentMenuName: row.menuName,

          // 默认值
          sort: row.child.length*10 + 10
        };
      }else if(type == 'addBtn') {//添加按钮
        this.rowData = {
          icon: '',
          component: '',
          superRedirect: '',

          parentId: row.menuId,
          menuType: 3,//按钮
          parentMenuName: row.menuName,

          // 默认值
          menuRoute: row.menuPath + '#',
          sort: row.child.length + 1
        };
      }else if(type == 'edit') {//编辑路由
        console.log('row', row);
        this.rowData = { ...row };
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    /**删除*/
    handleDel(row) {
      this.$confirm(`是否删除该路由【${row.menuName}】？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$api.del_one_menu(row.menuId);

        // 刷新列表
        this._getAllMenu();
        this.$message.success('删除成功!');
      }).catch((e) => {
        throw e;
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>