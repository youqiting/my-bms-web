<template>
    <div>
        <el-row>
            <el-col :span="24">
                <quill-editor
                    class="editor mini-scrollbar"
                    ref="myQuillEditor"
                    v-model="content_"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                    @change="onEditorChange($event)"
                >
                </quill-editor>
            </el-col>
        </el-row>
        <!-- 展示 slot: top / bottom  -->
        <!-- <miniapp-preview :content="contentPreview"></miniapp-preview> -->
    </div>
</template>

<script>
import { quill, quillEditor } from "vue-quill-editor";
import Quill from "quill";
export default {
    name: "baseEditor",
    props: {
        content: {
            type: String,
            default: function () {
                return ""
            }
        },
        hasVideo: {
            type: [Boolean,Number],
            default: function () {
                return false
            }
        }
    },
    watch:{
        content: function (newVal,oldVal){
            this.content_ = newVal;
        }
    },
    data() {
        return {
            content_: this.content,
            editorOption: {
                modules: {
                    toolbar: [
                        ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
                        [{ header: 1 }, { header: 2 }], // 1、2 级标题
                        [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
                        [{ indent: "-1" }, { indent: "+1" }], // 缩进
                        // [{'direction': 'rtl'}],                         // 文本方向
                        [{ size: ["small", false, "large", "huge"] }], // 字体大小
                        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                        [{ align: [] }], // 对齐方式
                        ["clean"], // 清除文本格式
                        [ "image","video"], // "link"链接、图片、"video"视频
                    ], //工具菜单栏配置
                },
                placeholder: "", //提示
                readyOnly: false, //是否只读
                theme: "snow", //主题 snow/bubble
                syntax: true, //语法检测
            },
            // editorOption: {
            //     modules: {
            //         toolbar: [
            //             ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
            //             ["blockquote", "code-block"], // 引用  代码块
            //             [{ header: 1 }, { header: 2 }], // 1、2 级标题
            //             [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
            //             [{ script: "sub" }, { script: "super" }], // 上标/下标
            //             [{ indent: "-1" }, { indent: "+1" }], // 缩进
            //             // [{'direction': 'rtl'}],                         // 文本方向
            //             [{ size: ["small", false, "large", "huge"] }], // 字体大小
            //             [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
            //             [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            //             [{ font: [] }], // 字体种类
            //             [{ align: [] }], // 对齐方式
            //             ["clean"], // 清除文本格式
            //             [ "image"], // "link"链接、图片、"video"视频
            //         ], //工具菜单栏配置
            //     },
            //     placeholder: "请在这里添加产品描述", //提示
            //     readyOnly: false, //是否只读
            //     theme: "snow", //主题 snow/bubble
            //     syntax: true, //语法检测
            // },
        };
    },
    mounted(){
        let that = this;
        this.$nextTick(function(){
            if(!this.hasVideo){
                document.getElementsByClassName("ql-video")[0].style = "display:none";
            }
            that.init_();
        })
    },
    methods: {
        init_() {
            var that = this;
            // 为视频ICON绑定事件
            this.$refs.myQuillEditor.quill
                .getModule("toolbar")
                .addHandler("video", function () {
                    var fileInput = document.querySelector(
                        "input.ql-video[type=file]"
                    );
                    if (fileInput == null) {
                        fileInput = document.createElement("input");
                        fileInput.setAttribute("type", "file");
                        fileInput.setAttribute('accept', 'video/mp4');
                        fileInput.classList.add("ql-video");
                        fileInput.addEventListener("change", function (e) {
                            if (
                                fileInput.files != null &&
                                fileInput.files[0] != null
                            ) {
                                if(fileInput.files[0].size > that.SystemConst.video.size){
                                    that.$Message.error("视频文件不得大于"+ that.SystemConst.video.sizeStr);
                                    return;
                                }
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    let value = e.target.result;
                                    let quill = that.$refs.myQuillEditor.quill; // 获取编辑器对象
                                    let addRange = quill.selection.savedRange; // 获取编辑器光标位置
                                    that.$refs.myQuillEditor.quill.insertEmbed(
                                        addRange !== null ? addRange.index : 0,
                                        "video",
                                        value,
                                        Quill.sources.USER
                                    );
                                    fileInput.value = "";
                                };
                            }
                            reader.readAsDataURL(fileInput.files[0]);
                        });
                        document
                            .getElementsByClassName("ql-toolbar")[0]
                            .appendChild(fileInput);
                    }
                    fileInput.click();
                }); 
            // 为图片image绑定事件， 限制图片上传大小
            this.$refs.myQuillEditor.quill
                .getModule("toolbar")
                .addHandler("image", function () {
                    var fileInput = document.querySelector(
                        "input.ql-image[type=file]"
                    );
                    if (fileInput == null) {
                        fileInput = document.createElement('input');
                        fileInput.setAttribute('type', 'file');
                        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
                        fileInput.classList.add('ql-image');
                        fileInput.addEventListener('change', function () {
                        if (fileInput.files != null && fileInput.files[0] != null) {
                            if (
                                fileInput.files != null &&
                                fileInput.files[0] != null
                            ) {
                                if(fileInput.files[0].size > that.SystemConst.image.size){
                                    that.$Message.error("图片文件不得大于"+ that.SystemConst.image.sizeStr);
                                    return;
                                }
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    let value = e.target.result;
                                    let quill = that.$refs.myQuillEditor.quill; // 获取编辑器对象
                                    let addRange = quill.selection.savedRange; // 获取编辑器光标位置
                                    console.log("image",addRange.index, quill.getSelection(true).index);
                                    that.$refs.myQuillEditor.quill.insertEmbed(
                                        addRange !== null ? addRange.index : 0,
                                        "image",
                                        value,
                                        Quill.sources.USER
                                    );
                                    // var range = _this3.quill.getSelection(true);
                                    // _this3.quill.updateContents(new _quillDelta2.default().retain(range.index).delete(range.length).insert({ image: e.target.result }), _emitter2.default.sources.USER);
                                    // _this3.quill.setSelection(range.index + 1, _emitter2.default.sources.SILENT);
                                    that.$refs.myQuillEditor.quill.setSelection(addRange.index + 1)
                                    fileInput.value = "";
                                };
                            }
                            reader.readAsDataURL(fileInput.files[0]);
                        }
                        });
                        this.container.appendChild(fileInput);
                    }
                    fileInput.click();
                });
        },
        onEditorBlur(e) {
            this.$emit("onEditorBlur", this.content_);
        },
        onEditorFocus(e) {
            this.$emit("onEditorFocus", this.content_);
        },
        onEditorReady(e) {
            this.$emit("onEditorReady", this.content_);
        },
        onEditorChange(e) {
            this.$emit("onEditorChange", this.content_);
        },
    },
};
</script>

<style lang="scss" scope>
strong {
    font-weight: bold;
}
.ql-editor{
    &::-webkit-scrollbar{
        width: 5px;
        background-color: #f1f1f1;
    }
    &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 5px;
        background-color:  #d2d2d2;
    }
}
</style>

<style>
/*  lang="scss" */
.editor {
    line-height: normal !important;
    /* height: 800px; */
}
.editor .ql-container {
    height: 600px;
}

.ql-snow.ql-toolbar input.ql-video[type="file"],
.ql-snow .ql-toolbar input.ql-video[type="file"] {
    display: none;
}

.ql-snow .ql-tooltip[data-mode="link"]::before {
    content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: "保存";
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
}
/* hover提示文字 */
/* .ql-snow.ql-toolbar button.ql-video{
    position: relative;
}
.ql-snow.ql-toolbar button.ql-video:hover::after {
		position: absolute;
		left: 10px;
		top: 20px;
		padding: 5px;
		color: rgb(0, 102, 204);;
        font-size: 12px;
		content: "上传视频";
		z-index: 2;
        width: 70px;
} */
</style>