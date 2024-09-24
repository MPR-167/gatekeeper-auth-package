import { decryptJsonData, encryptJsonData } from "@/lib/utils";
import { useEffect } from "react";

function Test() {
  async function anish() {
    const jsonData = { tenantId: 1, projectId: 2, customRoleId: 3 };
    const secretKey = "andi-mandi-sandi";

    const { encryptedData, iv } = await encryptJsonData(jsonData, secretKey);
    // console.log("Anish")
    // console.log(`The encrypted secret key is: ${encryptedData}`);
    // console.log(`The iv is: ${iv}`);
    // console.log(`The secret key is: ${secretKey}`);

    const retrievedData = await decryptJsonData({ encryptedData, iv }, secretKey);
    // console.log("Retrieved data:", retrievedData);
  }
  useEffect(() => {
    anish();
  }, []);
  return <div>Test</div>;
}

export default Test;
