// ############################# VUE code ############################# //

(function() {
    new Vue({
        el: "#main",
        data: {
            name: "S.",
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
            axios.get("/images").then(function(resp) {
                self.images = resp.data.rows;
            });
        }, // closes mounted
        methods: {
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
                        console.log("resp in POST / upload", resp);
                        self.images.unshift(resp.data);
                    }
                });
            }
        } // closes methods
    }); // closes vue instance
})();
