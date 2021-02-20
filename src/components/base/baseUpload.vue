<template>
    <div class="upload">
        <el-upload
            :action="`https://mpsaas.syni.com/material-service/material/upload/${folderId}`"
            :auto-upload="false"
            ref="upload"
            class="avatar-uploader"
            :headers="headers"
            :before-upload="beforeUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            multiple
            name="file"
            :on-change="handleChange"
            :limit="maxNumber"
            :on-success="handleSuccess"
            list-type="picture-card"
            :file-list="fileList"
            :class="{ hide: fileList.length == maxNumber }"
            accept="image/png, image/jpeg,image/jpg"
        >
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip" v-show="showTip">
                支持jpg, png, jpeg文件，单个文件不得大于{{maxSize}}M
            </div>
        </el-upload>

        <!-- 预览 -->
        <el-dialog append-to-body :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>

        
        <!-- 编辑 -->
        <!-- <el-dialog append-to-body :title="cropper && cropper.title?cropper.title:'编辑图片'" :visible.sync="cropperDialog" width="550px" center> -->
        <el-dialog append-to-body :title="cropper && cropper.title?cropper.title:'编辑图片'" :visible.sync="cropperDialog" :width="cropper?Number(cropper.w)+50+'px':'550px'" center>
            <el-row class="cropper-row">
              <el-col :span="24">
                <!-- <div class="cut"> -->
                <div class="cut" :style="{width:cropper? cropper.w+'px':'500px',height: cropper?cropper.h+'px':'500px'}">
                  <vue-cropper ref="cropper" :img="option.img" :output-size="option.size" :output-type="option.outputType" :info="true" :full="option.full" :fixed="option.fixed" :fixed-number="option.fixedNumber"
                    :can-move="option.canMove" :can-move-box="option.canMoveBox" :fixed-box="option.fixedBox" :original="option.original"
                    :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox"
                            @real-time="realTime" :high="option.high"
                    @img-load="imgLoad" :mode="option.mode || 'cover'" :max-img-size="option.max" @crop-moving="cropMoving"></vue-cropper>
                </div>
              </el-col>
              <!-- <el-col :span="10">
                <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
                    <div :style="previews.div">
                        <img :src="previews.url" :style="previews.img">
                    </div>
                </div>
              </el-col> -->
            </el-row>
            <span slot="footer">                
                <el-button class="width85" type="danger" size="small" @click="cropperDialog = false" >取消</el-button>
                <el-button class="width85" type="success" size="small" @click="comfireCropperDialog()" >确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import SystemConst from "@/constants/systemConstants"; //系统常量
export default {
    props: {
        folderId: {
            type: String,
            default: "",
        },
        maxNumber: {
            type: [Number, String],
            default: 3,
        },
        maxSize: {
            type: [Number, String],
            default:  2 * 1024 *1024,
        },
        maxSizeStr: {
            type: [String],
            default: '2M',
        },
        showTip: {
            type: [Number, Boolean],
            default: false,
        },
        imageList: {
            type: Array,
            default: ()=>[],
        },
        cropper: {
            type: Object,
            default: ()=> null,
        },
    },
    watch: {
        imageList: function (newValue, oldValue) {
            console.log(newValue)
            this.fileList = [...newValue];
            
        },
    },
    data() {
        return {
            headers: {
                Authorization:
                    "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxODY4ODE4MDYxMiIsInNjb3BlIjpbImFwcCJdLCJpZCI6NCwiaXNNZW1iZXIiOmZhbHNlLCJleHAiOjE1OTkxMjEwMjgsImp0aSI6ImQwOTM2YmQ1LWIzM2YtNGY3ZS1iYTFkLTU4MmMwNWNlOGExMSIsImNsaWVudF9pZCI6ImFwcCJ9.YrnT_pgPNAcWqR1YOKPs6uFbPg1omeHm2XhIXh78kRiQLzNDs917FBEdL-sg2XfZ-AInfJerRliBZJoPiq6p6xeWcMVWWvmcCmBBXPUd0ZSGYspj4wP0nER_VedbIq8oiSjCApby0auSM9pLuKztqJ3ZP4hjTE2-DY-Rpl605xk",
                // appid: "wx35ab15417be659f7",
            },
            fileList: [...this.imageList],
            dialogVisible: false,
            dialogImageUrl: "",
            // cropper  ------------
            cropperDialog: false,
            previews:{},
            option: {
                img: '',
                size: 1,
                // mode: 'contain', //图片默认渲染方式 contain , cover, 100px, 100% auto
                full: false,
                outputType: 'png',
                canMove: true,
                fixedBox: false,
                original: false, // 上传图片按照原始比例渲染
                canMoveBox: true,
                autoCrop: true,
                // 只有自动截图开启 宽度高度才生效
                autoCropWidth: this.cropper ? this.cropper.w*0.8 : 200,
                autoCropHeight:  this.cropper ? this.cropper.h*0.8 : 200,
                centerBox: false,//截图框是否被限制在图片里面
                high: true,
                max: 99999,
                fixed: true,
                fixedNumber: [this.cropper ? this.cropper.w : 200,  this.cropper ? this.cropper.h : 200],
            },
            cropperImg:{},
        };
    },
    methods: {
        upload() {
            this.$refs.upload.submit();
        },
        beforeUpload(file) {
            var max = this.maxSize;
            if (file.size > max) {
                this.$Message.error("单个文件不得大于"+ this.SystemConst.image.sizeStr);
                return false;
            }
        },
        handleSuccess(response, file, fileList) {
            this.fileList = [];
            this.$refs.upload.clearFiles();
            // this.$emit("success", response);
        },
        handleChange(file, fileList) {
            var max = this.maxSize; //kb
            if (file.size > max) {
                this.$Message.error("单个文件不得大于"+ this.maxSizeStr);
                this.fileList = fileList.slice(0, fileList.length -1);
                this.$emit("handleChange", null);
            }else{
                if(!this.$util.isEmpty(this.cropper)){
                   this.option.img = file.url; //fileList[fileList.length - 1].url;
                   this.fileList = fileList.slice(0, fileList.length -1);
                   this.cropperImg = {...file}
                   this.$nextTick(()=>{
                       this.cropperDialog = true
                   })
                }else{
                    // this.fileList = fileList
                    this.$emit("handleChange", file);
                }
            }
        },
        handleRemove(file, fileList) {
            this.$emit("handleRemove", fileList);
        },
        handlePreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        //  ------------- Cropper
        // 实时预览函数
        realTime(data) {
            this.previews = data
            // console.log(data)
        },
        imgLoad(msg) {
        //   console.log(msg)
        },
        cropMoving(data) {
        //   console.log(data, '截图框当前坐标')
        },
        comfireCropperDialog(){
            this.getCropperImg('base64').then(data=>{                
                this.cropperImg.url = data;
                this.$emit("handleChange", this.cropperImg);
                this.cropperDialog = false;
                // this.fileList.push(this.cropperImg)
                // this.cropperImg = null;
                // this.cropperDialog = false;
                // this.$emit("handleChange", this.fileList);
            })
        },
        getCropperImg(type) {
          // 输出
          return new Promise((resolve,reject)=>{
            if (type === 'blob') {
                this.$refs.cropper.getCropBlob((data) => {
                    resolve( window.URL.createObjectURL(data))
                })
            } else {
                this.$refs.cropper.getCropData((data) => {
                    resolve(data)
                })
            }
          })
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/styles/pageStyle/cropper.scss";
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.hide .el-upload {
    display: none !important;
}
.avatar-uploader .el-upload-list__item{
    transition: none;
    -webkit-transition: none;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
