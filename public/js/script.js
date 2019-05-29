// ############################# VUE code ############################# //

(function() {
    // ############################# POPUP Template ############################# //

    Vue.component("popup-model", {
        template: "#popup-template",
        props: ["clickedimg"],
        data: function() {
            return {
                modalContent: [],
                modalComments: [],
                form: {
                    comments: "",
                    username: "",
                    id: this.clickedimg
                }
            };
        },
        mounted: function getPopup() {
            var self = this;
            axios
                .get("/popupInfo/" + this.clickedimg)
                .then(resp => {
                    console.log("get resp", resp.data);
                    self.modalContent = resp.data[0];
                    self.modalComments = resp.data[1].reverse();
                    console.log("MODEL CONTENT", self.modalContent);
                    console.log("COMMENTS", self.modalComments);
                })
                .catch(err => console.log(err));
        }, // closes mounted
        methods: {
            sendComment: function() {
                var self = this;
                var formData = new FormData();
                formData.append("comment", this.form.comment);
                formData.append("username", this.form.username);
                axios.post("/sendComment", this.form).then(function(resp) {
                    self.modalComments.unshift(resp.data);
                });
            },
            closePopup: function() {
                this.$emit("close-popup");
            }
        },
        watch: {
            clickedimg: function() {
                this.clickedimg;
                this.getPopup();
                vm.dialog = true;
            }
        }
    }); // closes vue component

    // ############################ IMG upload VUE ############################ //

    var vm = new Vue({
        el: "#main",
        data: {
            clickedimg: location.hash.slice(1),
            dialog: false,
            name: "SAFIAN",
            form: {
                title: "",
                description: "",
                username: "",
                file: null
            },
            images: []
        }, // closes data
        mounted: function() {
            var self = this;
            axios
                .get("/images")
                .then(function(resp) {
                    self.images = resp.data.rows;
                })
                .catch(function(err) {
                    console.log(err);
                });
            addEventListener("hashchange", function() {
                self.clickedimg = location.hash.slice(1);
            });
        }, // closes mounted
        methods: {
            togglePopup: function(popup) {
                this.clickedimg = popup;
                this.dialog = false;
                history.pushState({}, "hello", "/");
            }, // closes togglePopup
            handleFileChange: function(e) {
                this.form.file = e.target.files[0];
            }, // closes handleFileChange
            uploadFile: function() {
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("username", this.form.username);
                formData.append("description", this.form.description);

                axios.post("/upload", formData).then(function(resp) {
                    if (resp.data.success === true) {
                        vm.images.unshift(resp.data);
                    }
                });
            }
        } // closes methods
    }); // closes vue instance
})();
