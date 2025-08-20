// 管理界面数据管理
class AdminManager {
    constructor() {
        this.data = this.loadData();
        this.currentEditingPhoto = null;
        this.init();
    }

    // 检查登录状态
    checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
        return isLoggedIn === 'true';
    }

    // 重定向到登录页面
    redirectToLogin() {
        window.location.href = 'login.html';
    }

    // 清除登录状态
    clearLoginStatus() {
        sessionStorage.removeItem('adminLoggedIn');
    }

    // 初始化管理界面
    init() {
        this.loadPhotos();
        this.loadPersonalInfo();
        this.loadContactInfo();
        this.bindEvents();
    }

    // 加载数据
    loadData() {
        const savedData = localStorage.getItem('personalWebsiteData');
        if (savedData) {
            return JSON.parse(savedData);
        }
        
        // 默认数据
        return {
            avatar: 'im/微信图片_20250812105150_19.jpg',
            photos: [
                {
                    id: 1,
                    url: 'im/微信图片_20250812105148_12.jpg',
                    title: '个人照片1',
                    description: '个人生活照片'
                },
                {
                    id: 2,
                    url: 'im/微信图片_20250812105149_13.jpg',
                    title: '个人照片2',
                    description: '个人生活照片'
                },
                {
                    id: 3,
                    url: 'im/微信图片_20250812105149_14.jpg',
                    title: '个人照片3',
                    description: '个人生活照片'
                },
                {
                    id: 4,
                    url: 'im/微信图片_20250812105149_15.jpg',
                    title: '个人照片4',
                    description: '个人生活照片'
                },
                {
                    id: 5,
                    url: 'im/微信图片_20250812105149_18.jpg',
                    title: '个人照片5',
                    description: '个人生活照片'
                },
                {
                    id: 6,
                    url: 'im/微信图片_20250812105150_16.jpg',
                    title: '个人照片6',
                    description: '个人生活照片'
                },
                {
                    id: 7,
                    url: 'im/微信图片_20250812105150_19.jpg',
                    title: '个人照片7',
                    description: '个人生活照片'
                }
            ],
            personalInfo: {
                name: 'win.zhang',
                title: '资深运维专家与数据库开发工程师',
                intro: '大家好！我是win.zhang，资深运维专家与数据库开发工程师，拥有近10年IT运维及团队管理经验，专注于网络、系统、数据库及机房的全栈式运维。\n\n具备RHCE、CCIE等行业认证，不仅擅长从零搭建高可用性基础设施，保障企业信息安全与高效运营，更能深度参与数据库开发与优化，为业务提供坚实的数据支撑。\n\n在工作之余，我喜欢摄影、旅行和阅读。这些爱好不仅丰富了我的生活，也为我的技术工作带来了新的灵感和视角。',
                hobbies: '摄影、旅行和阅读',
                skills: ['Linux运维', '数据库开发', '网络架构', '高可用性设计', '信息安全']
            },
            contactInfo: {
                email: 'win.zhang888@gmail.com',
                social: {
                    instagram: 'https://www.instagram.com/win.zhang686?igsh=eHNxdWZzM3BvdnN5&utm_source=qr',
                    twitter: 'https://x.com/win_zhang888?s=21',
                    telegram: 'https://t.me/Win_zha'
                }
            }
        };
    }

    // 保存数据
    saveData() {
        localStorage.setItem('personalWebsiteData', JSON.stringify(this.data));
        this.showSuccessMessage('数据已保存');
    }

    // 加载照片
    loadPhotos() {
        const photoGrid = document.getElementById('photoGrid');
        photoGrid.innerHTML = '';

        this.data.photos.forEach(photo => {
            const photoItem = this.createPhotoItem(photo);
            photoGrid.appendChild(photoItem);
        });
    }

    // 创建照片项目
    createPhotoItem(photo) {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${photo.url}" alt="${photo.title}" class="photo-preview" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuaPkuS7tjwvdGV4dD48L3N2Zz4='">
            <div class="photo-info">
                <div class="photo-title">${photo.title}</div>
                <div class="photo-description">${photo.description}</div>
                <div class="photo-actions">
                    <button class="btn btn-primary" onclick="adminManager.editPhoto(${photo.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-danger" onclick="adminManager.deletePhoto(${photo.id})">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            </div>
        `;
        return photoItem;
    }

    // 加载个人信息
    loadPersonalInfo() {
        const { personalInfo } = this.data;
        
        document.getElementById('personalName').value = personalInfo.name;
        document.getElementById('personalTitle').value = personalInfo.title;
        document.getElementById('personalIntro').value = personalInfo.intro;
        document.getElementById('personalHobbies').value = personalInfo.hobbies;
        
        // 加载头像
        if (this.data.avatar) {
            document.getElementById('avatarPreview').src = this.data.avatar;
        }
        
        this.loadSkills();
    }

    // 加载技能标签
    loadSkills() {
        const skillsList = document.getElementById('skillsList');
        skillsList.innerHTML = '';

        this.data.personalInfo.skills.forEach(skill => {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
                ${skill}
                <button class="remove-skill" onclick="adminManager.removeSkill('${skill}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            skillsList.appendChild(skillTag);
        });
    }

    // 加载联系信息
    loadContactInfo() {
        const { contactInfo } = this.data;
        
        document.getElementById('emailAddress').value = contactInfo.email;
        document.getElementById('instagramUrl').value = contactInfo.social.instagram;
        document.getElementById('twitterUrl').value = contactInfo.social.twitter;
        document.getElementById('telegramUrl').value = contactInfo.social.telegram;
    }

    // 绑定事件
    bindEvents() {
        // 技能输入框回车事件
        document.getElementById('newSkill').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addSkill();
            }
        });
    }

    // 保存表单数据
    saveFormData() {
        // 保存个人信息
        this.data.personalInfo.name = document.getElementById('personalName').value;
        this.data.personalInfo.title = document.getElementById('personalTitle').value;
        this.data.personalInfo.intro = document.getElementById('personalIntro').value;
        this.data.personalInfo.hobbies = document.getElementById('personalHobbies').value;

        // 保存联系信息
        this.data.contactInfo.email = document.getElementById('emailAddress').value;
        this.data.contactInfo.social.instagram = document.getElementById('instagramUrl').value;
        this.data.contactInfo.social.twitter = document.getElementById('twitterUrl').value;
        this.data.contactInfo.social.telegram = document.getElementById('telegramUrl').value;

        // 保存头像
        if (this.data.avatar) {
            // 头像已经在previewAvatar方法中更新
        }

        // 不自动保存，等待用户点击"保存所有更改"
    }

    // 修改密码
    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // 验证当前密码
        if (currentPassword !== 'admin') {
            this.showErrorMessage('当前密码不正确');
            return;
        }
        
        // 验证新密码
        if (!newPassword || newPassword.length < 3) {
            this.showErrorMessage('新密码长度至少为3位');
            return;
        }
        
        // 验证确认密码
        if (newPassword !== confirmPassword) {
            this.showErrorMessage('两次输入的密码不一致');
            return;
        }
        
        // 更新密码
        localStorage.setItem('adminPassword', newPassword);
        
        // 清空输入框
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        this.showSuccessMessage('密码修改成功！请记住新密码');
    }

    // 添加新照片
    addNewPhoto() {
        const newPhoto = {
            id: Date.now(),
            url: '',
            title: '新照片',
            description: '请输入照片描述'
        };

        this.data.photos.push(newPhoto);
        this.loadPhotos();
        this.editPhoto(newPhoto.id);
    }

    // 编辑照片
    editPhoto(photoId) {
        const photo = this.data.photos.find(p => p.id === photoId);
        if (!photo) return;

        this.currentEditingPhoto = photo;
        
        document.getElementById('photoTitle').value = photo.title;
        document.getElementById('photoDescription').value = photo.description;
        document.getElementById('photoUrl').value = photo.url;
        document.getElementById('photoFile').value = '';

        document.getElementById('photoModal').style.display = 'block';
    }

    // 保存照片更改
    savePhotoChanges() {
        if (!this.currentEditingPhoto) return;

        const title = document.getElementById('photoTitle').value;
        const description = document.getElementById('photoDescription').value;
        const url = document.getElementById('photoUrl').value;

        if (!title.trim() || !description.trim() || !url.trim()) {
            alert('请填写完整的照片信息');
            return;
        }

        this.currentEditingPhoto.title = title;
        this.currentEditingPhoto.description = description;
        this.currentEditingPhoto.url = url;

        this.loadPhotos();
        // 不自动保存，等待用户点击"保存所有更改"
        this.closePhotoModal();
    }

    // 删除照片
    deletePhoto(photoId) {
        this.currentEditingPhoto = this.data.photos.find(p => p.id === photoId);
        document.getElementById('deleteModal').style.display = 'block';
    }

    // 确认删除照片
    confirmDeletePhoto() {
        if (!this.currentEditingPhoto) return;

        const index = this.data.photos.findIndex(p => p.id === this.currentEditingPhoto.id);
        if (index > -1) {
            this.data.photos.splice(index, 1);
            this.loadPhotos();
            // 不自动保存，等待用户点击"保存所有更改"
        }

        this.closeDeleteModal();
    }

    // 添加技能
    addSkill() {
        const skillInput = document.getElementById('newSkill');
        const skill = skillInput.value.trim();

        if (!skill) {
            alert('请输入技能名称');
            return;
        }

        if (this.data.personalInfo.skills.includes(skill)) {
            alert('该技能已存在');
            return;
        }

        this.data.personalInfo.skills.push(skill);
        this.loadSkills();
        // 不自动保存，等待用户点击"保存所有更改"
        skillInput.value = '';
    }

    // 移除技能
    removeSkill(skill) {
        const index = this.data.personalInfo.skills.indexOf(skill);
        if (index > -1) {
            this.data.personalInfo.skills.splice(index, 1);
            this.loadSkills();
            // 不自动保存，等待用户点击"保存所有更改"
        }
    }

    // 关闭照片编辑模态框
    closePhotoModal() {
        document.getElementById('photoModal').style.display = 'none';
        this.currentEditingPhoto = null;
    }

    // 关闭删除确认模态框
    closeDeleteModal() {
        document.getElementById('deleteModal').style.display = 'none';
        this.currentEditingPhoto = null;
    }

    // 显示成功消息
    showSuccessMessage(message) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = message;
        document.body.appendChild(successMsg);

        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }

    // 保存所有更改
    saveAllChanges() {
        this.saveFormData();
        // 真正保存数据到localStorage
        this.saveData();
        this.showSuccessMessage('所有更改已保存');
    }

    // 重置为默认数据
    resetToDefault() {
        if (confirm('确定要重置为默认数据吗？这将清除所有已保存的更改。')) {
            // 清除localStorage中的数据
            localStorage.removeItem('personalWebsiteData');
            
            // 重新加载默认数据
            this.data = this.loadData();
            
            // 重新加载界面
            this.loadPhotos();
            this.loadPersonalInfo();
            this.loadContactInfo();
            
            // 更新头像预览
            if (this.data.avatar) {
                document.getElementById('avatarPreview').src = this.data.avatar;
            }
            
            this.showSuccessMessage('已重置为默认数据');
        }
    }

    // 导出数据
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'personal-website-data.json';
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // 导入数据
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.data = importedData;
                this.loadPhotos();
                this.loadPersonalInfo();
                this.loadContactInfo();
                // 不自动保存，等待用户点击"保存所有更改"
                this.showSuccessMessage('数据导入成功，请点击"保存所有更改"保存！');
            } catch (error) {
                alert('数据格式错误，导入失败');
            }
        };
        reader.readAsText(file);
    }
}

// 全局函数
function addNewPhoto() {
    adminManager.addNewPhoto();
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        adminManager.clearLoginStatus();
        window.location.href = 'login.html';
    }
}

function editPhoto(photoId) {
    adminManager.editPhoto(photoId);
}

function deletePhoto(photoId) {
    adminManager.deletePhoto(photoId);
}

function addSkill() {
    adminManager.addSkill();
}

function removeSkill(skill) {
    adminManager.removeSkill(skill);
}

function savePhotoChanges() {
    adminManager.savePhotoChanges();
}

function confirmDeletePhoto() {
    adminManager.confirmDeletePhoto();
}

function closePhotoModal() {
    adminManager.closePhotoModal();
}

function closeDeleteModal() {
    adminManager.closeDeleteModal();
}

function saveAllChanges() {
    adminManager.saveAllChanges();
}

function resetToDefault() {
    adminManager.resetToDefault();
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const photoModal = document.getElementById('photoModal');
    const deleteModal = document.getElementById('deleteModal');
    
    if (event.target === photoModal) {
        closePhotoModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}

// 修改密码函数
function changePassword() {
    if (window.adminManager) {
        window.adminManager.changePassword();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    
    if (isLoggedIn === 'true') {
        window.adminManager = new AdminManager();
        
        // 添加键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        saveAllChanges();
                        break;
                    case 'n':
                        e.preventDefault();
                        addNewPhoto();
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                closePhotoModal();
                closeDeleteModal();
            }
        });
    } else {
        // 如果没有登录，重定向到登录页面
        window.location.href = 'login.html';
    }
});

// 文件上传处理
document.addEventListener('DOMContentLoaded', () => {
    const photoFileInput = document.getElementById('photoFile');
    if (photoFileInput) {
        photoFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const photoUrlInput = document.getElementById('photoUrl');
                        if (photoUrlInput) {
                            photoUrlInput.value = e.target.result;
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('请选择图片文件');
                }
            }
        });
    }
});

// 拖拽上传支持
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.body;
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '';
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (window.adminManager) {
                        const newPhoto = {
                            id: Date.now(),
                            url: e.target.result,
                            title: '新上传的照片',
                            description: '请编辑照片信息'
                        };
                        
                        adminManager.data.photos.push(newPhoto);
                        adminManager.loadPhotos();
                        // 不自动保存，等待用户点击"保存所有更改"
                        adminManager.showSuccessMessage('照片上传成功');
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    });
});

// 头像预览和更新函数
function previewAvatar(input) {
    const file = input.files[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const avatarPreview = document.getElementById('avatarPreview');
                avatarPreview.src = e.target.result;
                
                                 // 更新数据中的头像
                 if (window.adminManager) {
                     window.adminManager.data.avatar = e.target.result;
                     // 不自动保存，等待用户点击"保存所有更改"
                     window.adminManager.showSuccessMessage('头像已更新，请点击"保存所有更改"保存！');
                 }
            };
            reader.readAsDataURL(file);
        } else {
            alert('请选择图片文件');
        }
    }
}
