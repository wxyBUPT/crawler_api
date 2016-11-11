
/**
 * Created by xiyuanbupt on 11/2/16.
 */

'use strict';
/**
 * 下面是在爬虫的配置,api 的配置应该和爬虫的配置一致
 *
 * [cnr_conf]
 xmly_top_n = XMLY_TOP_N
 ; 散列，内容为本次爬取的所有url
 xmly_topn_urls = XMLY_TOPN_URLS
 ; redis 中存储的一个K-V 值，值代表将新爬取的topn 数据存储到表名称
 xmly_topn_table = XMLY_TOPN_TABLE
 ; redis 中存储的一个K-V 值，值代表topn 历史抓取
 topn_report_table = TOPN_REPORT_TABLE
 * @type {{supervisor: {host: string, port: string, path: string}, supervisor_uri: string}}
 */

var config = {

    mode:'local',

    local:{
        mode:'local',
        port:3000,
        supervisor:{
            uri:'http://user:123@114.112.103.33:9001',
            // supervisor中xmly topn 的名称
            xmly_topn:"xmly_topn",
            kl_topn:"kl_topn",
            kl_full:"kl",
            xmly_full:"xmly",
            qt_topn:"qt_topn",
            qt_full:"qt",
            // 所有的增量爬取的实现逻辑都是全量爬取
            qt_increment:'qt',
            xmly_increment:'xmly',
            kl_increment:'kl',
            xmly_audio:"xmly_audio",
            qt_audio:"qt_audio",
            kl_audio:"kl_audio"
        },
        redis:{
            host:'114.112.103.33',
            port:6379,
        },
        xmly:{
            topn_n_key:"XMLY_TOP_N",
            topn_urls:"XMLY_TOPN_URLS",
            topn_table:"XMLY_TOPN_TABLE",
            // 下面的配置基本上不会使用,因为已经写死在代码中
            // 配置记录在这里
            audio_table : "xmly_audio",
            album_table : "xmly_album",
            category_table: "xmly_category"
        },
        kl:{

        },
        // uri 的配置和host port db 配置需要保持一致
        mongo:{
            host:'114.112.103.33',
            port:27017,
            db:'test_spider',
            uri:'mongodb://114.112.103.33:27017/test_spider'
        }
    },

    /**
    staging:{
        mode:'staging',
        port:4000,
        supervisor:{
            uri:'http://user:123@114.112.103.33:9001'
        },
        redis:{

        },
        xmly:{
            topn_n_key:"XMLY_TOP_N",
            topn_urls:"XMLY_TOPN_URLS",
            topn_table:"XMLY_TOPN_TABLE"
        },
        mongo:{

        }
    },

    production:{
        mode:'production',
        port:5000,
        supervisor:{

        },
        redis:{

        },
        xmly:{
            topn_n_key:"XMLY_TOP_N",
            topn_urls:"XMLY_TOPN_URLS",
            topn_table:"XMLY_TOPN_TABLE"
        },

        mongo:{

        }

    },

    supervisor:{
        host:'114.112.103.33',
        port:'9001',
        path:'/RPC2'
    },
     **/

};

module.exports = function (mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
};

