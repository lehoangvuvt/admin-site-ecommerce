import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, message } from "antd";
import axios from "axios";
Array.prototype.same = function (a) {
  return this.filter(function (i) {
    if (a.indexOf(i) < 0) {
      return false;
    } else {
      return true;
    }
  });
};

const EditRolePermission = (props) => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const basicRights = ["GET", "POST", "PUT", "DELETE"];

  useEffect(() => {
    form.setFieldsValue({
      resources: props.data.RESOURCE,
      rights: basicRights.same(props.data.RIGHT.split(",")),
    });
  }, [props]);

  const editRolePerm = async (values) => {
    await axios
      .put(
        "http://localhost:5035/permissions/roles/perm",
        {
          RESOUCRE_ID: props.data.RESOUCRE_ID,
          ROLE_ID: props.data.ROLE_ID,
          RIGHT: values.rights.toString(),
        },
        { withCredentials: true }
      )
      .then((res) => {
        setIsLoading(false);
        handleCancle();
        form.resetFields();
        props.getRolesPerm();
        console.log(res.data);
      })
      .catch((e) => {
        setIsLoading(false);
        if (e.response) {
          if (e.response.status === 403)
            message.error("Cannot access this resource!");
        }
      });
  };

  const handleOpen = () => {
    setVisible(true);
  };

  const handleCancle = () => {
    setVisible(false);
  };

  const handleSubmit = (values) => {
    setIsLoading(true);
    editRolePerm(values);
  };

  return (
    <div>
      <Button type="primary" size="middle" onClick={handleOpen}>
        Edit
      </Button>
      <Modal
        visible={visible}
        title="Edit Role's Permissions"
        okText="Edit"
        cancelText="Cancel"
        confirmLoading={isLoading}
        onCancel={handleCancle}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleSubmit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item name="resources" label="Resource">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="rights"
            label="Rights"
            rules={[
              {
                required: true,
                message: "Please select at least 1 right!",
              },
            ]}
          >
            <Select mode="multiple" allowClear placeholder="Please select">
              {basicRights.map((item) => (
                <Select.Option value={item}>{item}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditRolePermission;
