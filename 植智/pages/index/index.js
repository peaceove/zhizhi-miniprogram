const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

Page({
  data: {
    // 用户信息相关
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    
    // 新增功能数据
    generatedPlan: '',         // 生成的种植方案
    ringChartData: [],         // 环状图表数据
    userInput: '',             // 用户输入内容
    envParams: {              // 环境参数
      temperature: '--',
      humidity: '--',
      light: '--',
      soilMoisture: '--',
      tempStatus: 'normal',
      humidityStatus: 'normal',
      lightStatus: 'normal',
      soilStatus: 'normal'
    },
    showPlan: false,          // 控制方案是否显示
  },

  // 用户信息相关函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    const { nickName } = this.data.userInfo;
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    });
  },
  
  onInputChange(e) {
    const nickName = e.detail.value;
    const { avatarUrl } = this.data.userInfo;
    this.setData({
      "userInfo.nickName": nickName,
      "userInput": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    });
  },
  
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    });
  },

  // 处理用户输入
  onUserInput(e) {
    this.setData({ userInput: e.detail.value });
  },
  
  // 生成模拟方案
  generateMockPlan(input) {
    const keywords = input.toLowerCase();
    if (keywords.includes('阳台') || keywords.includes('盆栽')) {
      return `针对「${input}」的方案：推荐种植多肉/绿萝，选择疏松土壤，每周浇水1次，避免阳光直射。`;
    } else if (keywords.includes('花园') || keywords.includes('月季')) {
      return `针对「${input}」的方案：春季播种月季，需充足光照（每日≥4小时），定期施加有机肥。`;
    } else if (keywords.includes('蔬菜') || keywords.includes('果蔬')) {
      return `针对「${input}」的方案：选择排水良好的土壤，播种后保持土壤湿润，定期除虫。`;
    } else {
      return `针对「${input}」的通用方案：选择适宜植物类型的土壤，根据季节调整浇水量和光照时间。`;
    }
  },
  
  // 生成方案（合并并优化原有函数）
  generatePlan() {
    const userInput = this.data.userInput.trim();
    if (!userInput) {
      return wx.showToast({ 
        title: '请输入种植需求', 
        icon: 'none', 
        duration: 1500 
      });
    }
    
    // 显示加载状态
    wx.showLoading({ title: '生成中...', mask: true });
    
    // 模拟请求延迟
    setTimeout(() => {
      wx.hideLoading();
      const plan = this.generateMockPlan(userInput);
      this.setData({ 
        generatedPlan: plan,
        showPlan: true
      });
    }, 1000);
  },
  
  // 添加操作
  addOperation: function() {
    wx.showModal({
      title: '操作选项',
      content: '请选择操作类型',
      success: (res) => {
        if (res.confirm) {
          console.log('用户选择确定');
        }
      }
    });
  },

  // 页面加载时初始化数据
  onLoad: function() {
    // 初始化环状图表数据
    this.setData({
      ringChartData: [
        { name: 'PH值', value: 6.8, color: '#4CAF50' },
        { name: '湿度', value: 45, color: '#2196F3' }
      ]
    });

    // 模拟获取环境参数
    this.setData({
      envParams: {
        temperature: 22,
        humidity: 60,
        light: 1500,
        soilMoisture: 55,
        tempStatus: 'normal',
        humidityStatus: 'normal',
        lightStatus: 'normal',
        soilStatus: 'normal'
      }
    });
  },
  
  // 转发功能
  onShareAppMessage: function() {
    return {
      title: '植智 - 专业种植方案生成器',
      path: `/pages/index/index?userInput=${encodeURIComponent(this.data.userInput)}`,
      imageUrl: '/images/share.png',
      success: function(res) {
        wx.showToast({ title: '转发成功', icon: 'success' });
      },
      fail: function(res) {
        wx.showToast({ title: '转发失败', icon: 'none' });
      }
    };
  }
});

