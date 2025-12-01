import { Text } from "@medusajs/ui"

const MedusaCTA = () => {
  return (
    <Text className="flex items-center txt-compact-small-plus gap-x-1 text-gray-500">
      Built by{" "}
      <a
        href="https://github.com/ShaikhZaamir"
        target="_blank"
        rel="noreferrer"
        className="hover:text-gray-800 transition"
      >
        <span className="font-medium">Zaamir Shaikh</span>
      </a>
    </Text>
  )
}

export default MedusaCTA
