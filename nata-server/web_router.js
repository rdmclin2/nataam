module.exports = function () {
  var express = require('express');
  var eventproxy= require('eventproxy');

  var router = express.Router();
  var DeviceModel = require('./models/model_device.js');
  var RecordModel = require('./models/model_record.js');
  var ApkModel = require('./models/model_apk.js');

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('index', {
      title: '首页'
    });
  });

  ///**
  // * 获取创建测试任务页面
  // */
  //router.get('/create', function (req, res, next) {
  //  res.render('create', {
  //    title: '创建测试任务'
  //  });
  //});

  /**
   * 获取设备列表
   */
  router.get('/devices', function (req, res, next) {
    DeviceModel.find({}, function (err, devices) {
      if (err) {
        return res.status(500).json();
      }
      res.render('devices', {
        title: '设备列表',
        devices: devices
      });
    });
  });

  /**
   * 获取应用列表
   */
  router.get('/apks', function (req, res, next) {
    console.log("get here");
    ApkModel.find({}, function (err, apks) {
      if (err) {
        return res.status(500).json();
      }
      res.render('apks', {
        title: '应用列表',
        apks: apks
      });
    });
  });

  /**
   * 获取实时任务详情
   */
  router.get('/records/:id/run', function (req, res, next) {
    var record_id = req.params.id;
    RecordModel.findOne({
      _id: record_id
    }, function (err, record) {
      if (err || !record) {
        return res.status(500).json();
      }
      res.render('run', {
        title: '任务详情',
        record: record
      });
    });
  });

  /**
   * 重新运行
   */
  router.get('/records/:id/replay', function (req, res, next) {
    var record_id = req.params.id;
    RecordModel.findOne({
      _id: record_id
    }, function (err, record) {
      if (err || !record) {
        return res.status(500).json();
      }
      res.render('replay', {
        title: '回放',
        actions: record.actions
      });
    });
  });

  /**
   * 获取详细报告
   */
  router.get('/records/:id/report', function (req, res, next) {
    var record_id = req.params.id;
    RecordModel.findOne({
      _id: record_id
    }, function (err, record) {
      if (err || !record) {
        return res.status(500).json();
      }
      var summaries = record.summaries;

      var xData = [];
      var yDataWidget = [];
      var yDataActivity = [];
      for (var i = 0; i < summaries.length; i++) {
        xData.push(summaries[i].action);
        yDataActivity.push(summaries[i].activity);
        yDataWidget.push(summaries[i].widget);
      }
      console.log(xData);
      res.render('report', {
        title: '详细报告',
        xData: xData,
        yDataWidget: yDataWidget,
        yDataActivity: yDataActivity
      });
    });
  });

  /**
   * 获取任务列表
   */
  router.get('/records', function (req, res, next) {
    var ep = new eventproxy();
    ep.fail(next);

    ep.all('records','devices','apks',function(records,devices,apks){

      records.forEach(function (record) {
        console.log(record.apk_id);
        ApkModel.findOne({_id: record.apk_id}).exec(ep.done(function (apk) {
          record.apk_name = apk.name;
          record.package_name = apk.package_name;
          record.activity_name = apk.activity_name;
          ep.emit('apk');
        }));
      });

      ep.after('apk', records.length, function () {
        res.render('records', {
          title: '自动遍历任务',
          records: records,
          devices: devices,
          apks: apks
        });
      })
    });

    RecordModel.find({}).sort({create_at: -1}).exec(ep.done("records"));
    DeviceModel.find({}).sort({create_at: -1}).exec(ep.done("devices"));
    ApkModel.find({}).sort({create_at: -1}).exec(ep.done("apks"));

  });


  /**
   * 获取任务列表
   */
  router.get('/recordtestcase', function (req, res, next) {
    res.render('recordtestcase', {
      title: '录制测试脚本',
    });

  });


  // /**
  //  * 创建测试任务
  //  */
  // router.post('/test', function(req, res, next) {

  // });

  //router.get('/run',function(req,res,next){
  //    res.render('run',{ title : '实时测试'});
  //});

  //router.get('/contact',function(req,res,next){
  //    res.render('contact',{ title : '联系我们'});
  //});

  // router.get('/records', function(req, res, next) {
  //     res.render('records', { title: '测试记录' });
  // });

  return router;
};